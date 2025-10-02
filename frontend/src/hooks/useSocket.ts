import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../stores/authStore';

export const useSocket = (roomId?: string) => {
  const socketRef = useRef<Socket | null>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user || !roomId) return;

    socketRef.current = io(import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001', {
      auth: {
        userId: user.uid,
        userName: user.displayName || user.email,
        roomId
      }
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [user, roomId]);

  return socketRef.current;
};