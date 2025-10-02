import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Store room data
const rooms = new Map();
const userRoles = new Map();

interface User {
  id: string;
  name: string;
  role: 'admin' | 'editor' | 'viewer';
  socketId: string;
}

interface Room {
  id: string;
  users: Map<string, User>;
  drawings: any[];
  messages: any[];
}

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-room', ({ roomId, userId, userName }) => {
    socket.join(roomId);
    
    if (!rooms.has(roomId)) {
      rooms.set(roomId, {
        id: roomId,
        users: new Map(),
        drawings: [],
        messages: []
      });
    }

    const room = rooms.get(roomId);
    const isFirstUser = room.users.size === 0;
    const userRole = isFirstUser ? 'admin' : 'editor';

    const user: User = {
      id: userId,
      name: userName,
      role: userRole,
      socketId: socket.id
    };

    room.users.set(userId, user);
    userRoles.set(socket.id, { userId, roomId, role: userRole });

    // Send current canvas state to new user
    socket.emit('canvas-state', room.drawings);
    socket.emit('chat-history', room.messages);

    // Update all users in room about active users
    const activeUsers = Array.from(room.users.values()).map((u) => ({
      id: (u as User).id,
      name: (u as User).name,
      role: (u as User).role
    }));
    
    io.to(roomId).emit('users-update', activeUsers);
    
    console.log(`User ${userName} joined room ${roomId} as ${userRole}`);
  });

  socket.on('drawing', (drawingData) => {
    const userInfo = userRoles.get(socket.id);
    if (!userInfo) return;

    const room = rooms.get(userInfo.roomId);
    if (!room) return;

    // Check if user has drawing permissions
    const user = room.users.get(userInfo.userId);
    if (!user || user.role === 'viewer') return;

    room.drawings.push(drawingData);
    socket.to(userInfo.roomId).emit('drawing', drawingData);
  });

  socket.on('clear-canvas', () => {
    const userInfo = userRoles.get(socket.id);
    if (!userInfo) return;

    const room = rooms.get(userInfo.roomId);
    if (!room) return;

    const user = room.users.get(userInfo.userId);
    if (!user || user.role === 'viewer') return;

    room.drawings = [];
    io.to(userInfo.roomId).emit('canvas-cleared');
  });

  socket.on('message', (message) => {
    const userInfo = userRoles.get(socket.id);
    if (!userInfo) return;

    const room = rooms.get(userInfo.roomId);
    if (!room) return;

    room.messages.push(message);
    io.to(userInfo.roomId).emit('message', message);
  });

  socket.on('disconnect', () => {
    const userInfo = userRoles.get(socket.id);
    if (userInfo) {
      const room = rooms.get(userInfo.roomId);
      if (room) {
        room.users.delete(userInfo.userId);
        
        // Update active users
        const activeUsers = Array.from(room.users.values()).map((u) => ({
          id: (u as User).id,
          name: (u as User).name,
          role: (u as User).role
        }));
        
        io.to(userInfo.roomId).emit('users-update', activeUsers);
        
        // Clean up empty rooms
        if (room.users.size === 0) {
          rooms.delete(userInfo.roomId);
        }
      }
      userRoles.delete(socket.id);
    }
    
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});