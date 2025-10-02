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

      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome to CollabBoard
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Create a new room or join an existing one to start collaborating.
        </Typography>

        <Box sx={{ display: 'flex', gap: 3, mt: 2, flexWrap: 'wrap' }}>
          <Box sx={{ flex: 1, minWidth: 300 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Create New Room
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Start a new collaborative whiteboard session
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={createRoom}
                  fullWidth
                >
                  Create Room
                </Button>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ flex: 1, minWidth: 300 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Join Room
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Enter room ID to join existing session
                </Typography>
                <TextField
                  fullWidth
                  label="Room ID"
                  value={joinRoomId}
                  onChange={(e) => setJoinRoomId(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <Button
                  variant="outlined"
                  onClick={joinRoom}
                  fullWidth
                  disabled={!joinRoomId.trim()}
                >
                  Join Room
                </Button>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Container>
    </>
  );
};