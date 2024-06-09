const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const bodyParser = require('body-parser');
const cors = require('cors');


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  }
});
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,POST,PUT,DELETE',
  credentials: true
}));


const { generateRoomId } = require('./functions/tictactoe-utilities');

// VARIABLES
const activeUsers = {};
let gameRooms = {};
let board = [[11, 12, 13], [21, 22, 23], [31, 32, 33]];
let winner = "";
let winnerClass = "";

const checkWinner = (board) => {
  // Check for a winner in columns
  for (let col = 0; col < board.length; col++) {
      if(board[0][col] === board[1][col] && board[1][col] === board[2][col]) {
        game.winner = board[0][col];
        game.winnerClass = col === 0 ? 'col-left' : col === 1 ? 'col-center' : 'col-right';
      }
  }
  // Check for a winner in rows
  for (let row = 0; row < board.length; row++) {
      if(board[row][0] === board[row][1] && board[row][1] === board[row][2]) {
        winner = board[row][0];
        winnerClass = row === 0 ? 'row-up' : row === 1 ? 'row-center' : 'row-down';
      } 
  }
  // Check X
  if(board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
     winner = board[0][0];
     winnerClass = 'diagonal-left';
  } 
  if(board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
    winner = board[0][2]
    winnerClass = 'diagonal-right';
  } 
  
  return
}

// SOCKET REQUESTS
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  activeUsers[socket.id] = true;
  io.emit('activeUsers', Object.keys(activeUsers));

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
    delete activeUsers[socket.id];
    io.emit('activeUsers', Object.keys(activeUsers));
    board = [[11, 12, 13], [21, 22, 23], [31, 32, 33]];
    winner = "";
    winnerClass = "";
  });

  socket.on('invite', (recipientId, senderId) => {
    const roomId = generateRoomId();
    socket.join(roomId);
    gameRooms[roomId] = { board , winner, winnerClass };
    io.to(recipientId).emit('invitation', { roomId });
    io.to(senderId).emit('invitation', { roomId });
  });

  socket.on('acceptInvitation', ({ roomId }) => {
    socket.join(roomId);
    console.log(`Invitation accepted for room ${roomId}`);
    io.to(roomId).emit('invitationAccepted');
  });

  socket.on('userReset', ({ roomId }, callback) => {
    board = [[11, 12, 13], [21, 22, 23], [31, 32, 33]];
    winner = "";
    winnerClass = "";
    gameRooms[roomId] = { board, winner, winnerClass };
    const data = gameRooms[roomId];
    io.to(roomId).emit('resetBoard', data);
    callback({ success: true, data });
  });

  socket.on('userMove', ({ roomId, rowIndex, boxIndex, player }, callback) => {
    const game = gameRooms[roomId];
    if (!game || game.winner) {
      return callback({ success: false, error: 'Invalid move or game already won' });
    }
    if(isNaN(game.board[rowIndex][boxIndex])) { 
      return callback({ success: false, error: 'Please choose another box, this one is taken.' });
    }
    game.board[rowIndex][boxIndex] = player;
    checkWinner(game.board);

    const data = { board: game.board, winner, winnerClass };
    io.to(roomId).emit('updateUserBoard', data);
    callback({ success: true, data });
  });

  socket.on('chatMessage', (data) => {
    const { roomId, userId, message } = data;
    io.to(roomId).emit('chatMessage', { userId, message });
  });
});



// Starting the server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
