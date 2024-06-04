const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const bodyParser = require('body-parser');
const cors = require('cors');

// ROUTING
const triviaRoutes = require('./routes/trivia-routes'); //I kept this part in front-end, for now.
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

// SOCKET
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

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

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);

    socket.rooms.forEach(room => {
      socket.leave(room);
      const clients = Array.from(io.sockets.adapter.rooms.get(room) || []);
      io.to(room).emit('roomMembers', clients);
    });
  });
});

app.use(bodyParser.json());

// CORS
app.use(cors({
  origin: 'http://localhost:3000', 
  methods: 'GET,POST,PUT,DELETE', 
  credentials: true 
}));

app.use('/auth', triviaRoutes);
app.use('/tic-tac-toe', tictactoeRoutes);

// SERVER
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
