
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle messages
    socket.on('message', (data) => {
        // Broadcast the message to all connected clients
        io.emit('message', data);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

export const WebSocketServer = `http://localhost:${PORT}`;
