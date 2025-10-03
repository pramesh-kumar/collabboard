import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../stores/authStore';

export const useSocket = (roomId?: string) => {
  const socketRef = useRef<Socket | null>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user || !roomId) return;

    console.log('Connecting to socket...', { roomId, userId: user.uid });
    
    socketRef.current = io(import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001', {
      transports: ['websocket', 'polling']
    });

    socketRef.current.on('connect', () => {
      console.log('Socket connected:', socketRef.current?.id);
    });

    socketRef.current.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [user, roomId]);

  return socketRef.current;
};