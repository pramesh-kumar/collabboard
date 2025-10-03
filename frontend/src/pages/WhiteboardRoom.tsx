import React, { useEffect, useState } from 'react';
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
import { VideoCall as VideoCallComponent } from '../components/Video/VideoCall';
import { useSocket } from '../hooks/useSocket';
import { useWhiteboardStore } from '../stores/whiteboardStore';
import { useAuthStore } from '../stores/authStore';

export const WhiteboardRoom: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const socket = useSocket(roomId);
  const { setActiveUsers } = useWhiteboardStore();
  const { user } = useAuthStore();
  const [showVideoCall, setShowVideoCall] = useState(false);

  useEffect(() => {
    if (!socket || !user) return;

    console.log('Setting up socket listeners...');

    socket.on('users-update', (users: Array<{ id: string; name: string; role: string }>) => {
      console.log('Users updated:', users);
      setActiveUsers(users);
    });

    socket.on('connect', () => {
      console.log('Socket connected, joining room...');
      socket.emit('join-room', {
        roomId,
        userId: user.uid,
        userName: user.displayName || user.email
      });
    });

    // If already connected, join room immediately
    if (socket.connected) {
      socket.emit('join-room', {
        roomId,
        userId: user.uid,
        userName: user.displayName || user.email
      });
    }

    return () => {
      socket.off('users-update');
      socket.off('connect');
    };
  }, [socket, roomId, user, setActiveUsers]);

  if (!roomId) {
    return <div>Invalid room ID</div>;
  }

  return (
    <Box sx={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <AppBar position="static" sx={{ width: '100%' }}>
        <Toolbar sx={{ width: '100%' }}>
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
            onClick={() => setShowVideoCall(true)}
          >
            Video Call
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ flexGrow: 1, display: 'flex', overflow: 'hidden', width: '100%' }}>
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
          <WhiteboardToolbar />
          <Canvas roomId={roomId} />
        </Box>
        <ChatSidebar roomId={roomId} />
      </Box>
      
      {showVideoCall && (
        <VideoCallComponent
          roomId={roomId}
          onClose={() => setShowVideoCall(false)}
        />
      )}
    </Box>
  );
};