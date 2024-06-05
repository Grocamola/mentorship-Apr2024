const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const bodyParser = require('body-parser');
const cors = require('cors');

const triviaRoutes = require('./routes/trivia-routes');
const tictactoeRoutes = require('./routes/tictactoe-routes');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  }
});

app.use(express.static('public'));

const activeUsers = {};

function generateRoomId() {
  return Math.random().toString(36).substring(7);
}

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
    console.log(`User ${senderId} invited ${recipientId} to room ${roomId}`);
    io.to(recipientId).emit('invitation', { roomId });
  });

  socket.on('acceptInvitation', ({ roomId }) => {
    socket.join(roomId);
    console.log(`Invitation accepted for room ${roomId}`);
    io.to(roomId).emit('invitationAccepted');
  });

  socket.on('joinRoom', (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room ${room}`);
    const clients = Array.from(io.sockets.adapter.rooms.get(room) || []);
    io.to(room).emit('roomMembers', clients);
  });

  socket.on('leaveRoom', (room) => {
    socket.leave(room);
    console.log(`User ${socket.id} left room ${room}`);
    const clients = Array.from(io.sockets.adapter.rooms.get(room) || []);
    io.to(room).emit('roomMembers', clients);
  });

  socket.on('privateMessage', (data) => {
    const { recipientId, message } = data;
    io.to(recipientId).emit('privateMessage', {
      senderId: socket.id,
      message: message
    });
  });

  socket.on('chatMessage', (data) => {
    const { userId, message } = data;
    console.log(`Message received from ${userId}: ${message}`);
    io.emit('chatMessage', { userId, message });
  });
});

app.use(bodyParser.json());

app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,POST,PUT,DELETE',
  credentials: true
}));

app.use('/auth', triviaRoutes);
app.use('/tic-tac-toe', tictactoeRoutes);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
