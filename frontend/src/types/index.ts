export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export type UserRole = 'admin' | 'editor' | 'viewer';

export interface Room {
  id: string;
  name: string;
  createdBy: string;
  createdAt: Date;
  activeUsers: User[];
}

export interface DrawingData {
  x: number;
  y: number;
  prevX?: number;
  prevY?: number;
  color: string;
  size: number;
  tool: 'brush' | 'eraser';
  userId: string;
  timestamp: number;
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: number;
}

export interface SocketEvents {
  'join-room': (data: { roomId: string; userId: string; userName: string }) => void;
  'drawing': (data: DrawingData) => void;
  'clear-canvas': () => void;
  'message': (data: ChatMessage) => void;
  'canvas-state': (drawings: DrawingData[]) => void;
  'chat-history': (messages: ChatMessage[]) => void;
  'users-update': (users: User[]) => void;
  'canvas-cleared': () => void;
}