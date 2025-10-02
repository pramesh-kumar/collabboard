import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button
} from '@mui/material';
import { ArrowBack, VideoCall } from '@mui/icons-material';
import { Canvas } from '../components/Whiteboard/Canvas';
import { Toolbar as WhiteboardToolbar } from '../components/Whiteboard/Toolbar';
import { ChatSidebar } from '../components/Chat/ChatSidebar';
import { useSocket } from '../hooks/useSocket';
import { useWhiteboardStore } from '../stores/whiteboardStore';
import { useAuthStore } from '../stores/authStore';

export const WhiteboardRoom: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const socket = useSocket(roomId);
  const { setActiveUsers } = useWhiteboardStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!socket) return;

    socket.on('users-update', (users: Array<{ id: string; name: string; role: string }>) => {
      setActiveUsers(users);
    });

    socket.emit('join-room', {
      roomId,
      userId: user?.uid,
      userName: user?.displayName || user?.email
    });

    return () => {
      socket.off('users-update');
    };
  }, [socket, roomId, user, setActiveUsers]);

  if (!roomId) {
    return <div>Invalid room ID</div>;
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Room: {roomId}
          </Typography>
          <Button
            color="inherit"
            startIcon={<VideoCall />}
            onClick={() => {/* TODO: Implement video call */}}
          >
            Video Call
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ flexGrow: 1, display: 'flex', overflow: 'hidden' }}>
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
          <WhiteboardToolbar />
          <Canvas roomId={roomId} />
        </Box>
        <ChatSidebar roomId={roomId} />
      </Box>
    </Box>
  );
};