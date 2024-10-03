// server.js

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// Initialize express and create an HTTP server
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve the frontend files (HTML, CSS, JS)
app.use(express.static('public'));

// Handle WebSocket connection
io.on('connection', (socket) => {
  console.log('A user connected');

  // Listen for chat messages
  socket.on('chatMessage', (msg) => {
    io.emit('chatMessage', msg); // Broadcast message to all clients
  });

  // Handle user disconnecting
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
