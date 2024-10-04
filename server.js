// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public')); // Serve static files from the public directory

io.on('connection', (socket) => {
    console.log('A user connected');

    // Listen for the sendMessage event
    socket.on('sendMessage', (message) => {
        // Broadcast the message to all clients except the sender
        socket.broadcast.emit('receiveMessage', message); // Send to others
    });

    // Listen for user typing notifications
    socket.on('userTyping', () => {
        socket.broadcast.emit('userTyping'); // Notify others that someone is typing
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Start the server
server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
