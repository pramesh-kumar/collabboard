import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Chip
} from '@mui/material';
import { Send } from '@mui/icons-material';
import { useSocket } from '../../hooks/useSocket';
import { useAuthStore } from '../../stores/authStore';
import { useWhiteboardStore } from '../../stores/whiteboardStore';

interface Message {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: Date;
}

interface ChatSidebarProps {
  roomId: string;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({ roomId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socket = useSocket(roomId);
  const { user } = useAuthStore();
  const { activeUsers } = useWhiteboardStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!socket) return;

    socket.on('message', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    socket.on('chat-history', (history: Message[]) => {
      setMessages(history);
    });

    return () => {
      socket.off('message');
      socket.off('chat-history');
    };
  }, [socket]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket || !user) return;

    const message: Message = {
      id: Date.now().toString(),
      userId: user.uid,
      userName: user.displayName || user.email || 'Anonymous',
      message: newMessage.trim(),
      timestamp: new Date()
    };

    socket.emit('message', message);
    setNewMessage('');
  };

  return (
    <Paper elevation={2} sx={{ width: 300, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6">Chat</Typography>
        <Typography variant="body2" color="text.secondary">
          {activeUsers.length} users online
        </Typography>
      </Box>

      <Box sx={{ p: 1, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="subtitle2" gutterBottom>Active Users:</Typography>
        <Box display="flex" flexWrap="wrap" gap={0.5}>
          {activeUsers.map((user) => (
            <Chip
              key={user.id}
              label={user.name}
              size="small"
              color={user.role === 'admin' ? 'primary' : user.role === 'editor' ? 'secondary' : 'default'}
            />
          ))}
        </Box>
      </Box>

      <Box sx={{ flexGrow: 1, overflow: 'auto', p: 1 }}>
        <List dense>
          {messages.map((msg) => (
            <ListItem key={msg.id} sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
              <Box display="flex" justifyContent="space-between" width="100%">
                <Typography variant="caption" color="primary">
                  {msg.userName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </Typography>
              </Box>
              <ListItemText
                primary={msg.message}
                sx={{ mt: 0.5, wordBreak: 'break-word' }}
              />
            </ListItem>
          ))}
        </List>
        <div ref={messagesEndRef} />
      </Box>

      <Box component="form" onSubmit={sendMessage} sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Box display="flex" gap={1}>
          <TextField
            fullWidth
            size="small"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <IconButton type="submit" color="primary" disabled={!newMessage.trim()}>
            <Send />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
};