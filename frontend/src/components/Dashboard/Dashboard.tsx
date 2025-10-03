import React, { useState } from 'react';
import {
  Container,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  IconButton,
  Box
} from '@mui/material';

import { Add, Logout } from '@mui/icons-material';
import { signOut } from 'firebase/auth';
import { auth } from '../../utils/firebase';
import { useAuthStore } from '../../stores/authStore';
import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {

  const [joinRoomId, setJoinRoomId] = useState('');
  const { user, setUser } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const createRoom = () => {
    const roomId = Math.random().toString(36).substring(2, 15);
    navigate(`/room/${roomId}`);
  };

  const joinRoom = () => {
    if (joinRoomId.trim()) {
      navigate(`/room/${joinRoomId}`);
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            CollabBoard
          </Typography>
          <Typography variant="body2" sx={{ mr: 2 }}>
            {user?.displayName || user?.email}
          </Typography>
          <IconButton color="inherit" onClick={handleLogout}>
            <Logout />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4, minHeight: 'calc(100vh - 64px)' }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
            Welcome to CollabBoard
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Create a new room or join an existing one to start collaborating in real-time.
          </Typography>
        </Box>

        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 4,
          maxWidth: 800,
          mx: 'auto'
        }}>
          <Card elevation={3} sx={{ height: 'fit-content' }}>
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                Create New Room
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Start a new collaborative whiteboard session
              </Typography>
              <Button
                variant="contained"
                size="large"
                startIcon={<Add />}
                onClick={createRoom}
                fullWidth
                sx={{ py: 1.5 }}
              >
                Create Room
              </Button>
            </CardContent>
          </Card>

          <Card elevation={3} sx={{ height: 'fit-content' }}>
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                Join Room
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Enter room ID to join existing session
              </Typography>
              <TextField
                fullWidth
                label="Room ID"
                value={joinRoomId}
                onChange={(e) => setJoinRoomId(e.target.value)}
                sx={{ mb: 3 }}
                size="medium"
              />
              <Button
                variant="outlined"
                size="large"
                onClick={joinRoom}
                fullWidth
                disabled={!joinRoomId.trim()}
                sx={{ py: 1.5 }}
              >
                Join Room
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </>
  );
};