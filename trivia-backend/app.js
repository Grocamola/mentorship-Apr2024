const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const bodyParser = require('body-parser');
const cors = require('cors');

const { generateRoomId, checkWinner } = require('./functions/tictactoe-utilities');

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

const activeUsers = {};
let gameRooms = {};

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  activeUsers[socket.id] = true;
  io.emit('activeUsers', Object.keys(activeUsers));

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
    delete activeUsers[socket.id];
    io.emit('activeUsers', Object.keys(activeUsers));
  });

  socket.on('invite', (recipientId, senderId) => {
    const roomId = generateRoomId();
    socket.join(roomId);
    gameRooms[roomId] = { board: [[11, 12, 13], [21, 22, 23], [31, 32, 33]], winner: '', winnerClass: '' };
    io.to(recipientId).emit('invitation', { roomId });
    io.to(senderId).emit('invitation', { roomId });
  });

  socket.on('acceptInvitation', ({ roomId }) => {
    socket.join(roomId);
    console.log(`Invitation accepted for room ${roomId}`);
    io.to(roomId).emit('invitationAccepted');
  });

  socket.on('userReset', ({ roomId }, callback) => {
    gameRooms[roomId] = { board: [[11, 12, 13], [21, 22, 23], [31, 32, 33]], winner: '', winnerClass: '' };
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

    const data = game;
    io.to(roomId).emit('updateUserBoard', data);
    callback({ success: true, data });
  });

  socket.on('chatMessage', (data) => {
    const { roomId, userId, message } = data;
    io.to(roomId).emit('chatMessage', { userId, message });
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
