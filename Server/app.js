const express = require('express');
const app = express();
require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const server = http.createServer(app);

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const PORT = process.env.PORT || 5555;

// Configure CORS with explicit origin
app.use(cors({
    origin: FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true
}));

app.use(express.json());

const io = new Server(server, {
    cors: {
        origin: FRONTEND_URL,
        methods: ["GET", "POST"],
        credentials: true
    },
    pingTimeout: 120000,
    pingInterval: 30000,
    transports: ['websocket', 'polling']
});

const userSocketMap = {};
const getAllConnectedClients = (roomId) => {
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => {
        return {
            socketId,
            username: userSocketMap[socketId]
        };
    });
}

io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Handle joining room
    socket.on('join', ({ roomId, username }) => {
        try {
            // Add user to map
            userSocketMap[socket.id] = username;
            socket.join(roomId);

            // Get all clients in the room
            const clients = getAllConnectedClients(roomId);
            
            // Notify all clients about the new user
            clients.forEach(({ socketId }) => {
                io.to(socketId).emit('user-joined', {
                    clients,
                    username,
                    socketId: socket.id
                });
            });
        } catch (error) {
            console.error('Join error:', error);
        }
    });

    // Handle code changes with sender information
    socket.on('code-change', ({ roomId, code, sender }) => {
        try {
            // Emit to all clients in the room except sender
            socket.to(roomId).emit('code-change', { code, sender });
        } catch (error) {
            console.error('Code change error:', error);
        }
    });

    // Handle sync request
    socket.on('sync-code', ({ socketId, code }) => {
        try {
            io.to(socketId).emit('code-sync', { code });
        } catch (error) {
            console.error('Sync error:', error);
        }
    });

    // Handle disconnectiona
    socket.on('disconnect', () => {
        try {
            // Find all rooms this socket was in
            const rooms = [...socket.rooms];
            rooms.forEach(roomId => {
                const clients = getAllConnectedClients(roomId);
                clients.forEach(({ socketId }) => {
                    io.to(socketId).emit('user-disconnected', {
                        socketId: socket.id,
                        username: userSocketMap[socket.id]
                    });
                });
            });
            delete userSocketMap[socket.id];
        } catch (error) {
            console.error('Disconnect error:', error);
        }
    });

    // Handle leaving room
    socket.on('leave', ({ roomId, username }) => {
        try {
            socket.leave(roomId);
            const clients = getAllConnectedClients(roomId);
            clients.forEach(({ socketId }) => {
                io.to(socketId).emit('user-left', {
                    socketId: socket.id,
                    username
                });
            });
        } catch (error) {
            console.error('Leave error:', error);
        }
    });

    // Handle messages with proper event names
    socket.on('send-message', ({ roomId, message, sender, time }) => {
        try {
            // Broadcast the message to all clients in the room, including sender
            // This ensures everyone gets exactly one copy of the message
            io.in(roomId).emit('receive-message', {
                message,
                sender,
                time
            });
        } catch (error) {
            console.error('Message error:', error);
        }
    });
});

// io.on('connection',(socket)=>
// {

  
// });

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Accepting connections from: ${FRONTEND_URL}`);
});
