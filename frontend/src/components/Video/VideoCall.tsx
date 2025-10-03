import React, { useRef, useEffect, useState } from 'react';
import {
  Box,
  IconButton,
  Paper,
  Typography
} from '@mui/material';
import {
  Videocam,
  VideocamOff,
  Mic,
  MicOff,
  CallEnd
} from '@mui/icons-material';
import { useSocket } from '../../hooks/useSocket';
import { useAuthStore } from '../../stores/authStore';

interface VideoCallProps {
  roomId: string;
  onClose: () => void;
}

export const VideoCall: React.FC<VideoCallProps> = ({ roomId, onClose }) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  
  const socket = useSocket(roomId);
  const { user } = useAuthStore();

  useEffect(() => {
    initializeMedia();
    setupPeerConnection();
    
    return () => {
      cleanup();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('video-offer', handleVideoOffer);
    socket.on('video-answer', handleVideoAnswer);
    socket.on('ice-candidate', handleIceCandidate);
    socket.on('user-left-video', handleUserLeftVideo);

    return () => {
      socket.off('video-offer');
      socket.off('video-answer');
      socket.off('ice-candidate');
      socket.off('user-left-video');
    };
  }, [socket]);

  const initializeMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  };

  const setupPeerConnection = () => {
    const configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }
      ]
    };

    peerConnectionRef.current = new RTCPeerConnection(configuration);

    peerConnectionRef.current.onicecandidate = (event) => {
      if (event.candidate && socket) {
        socket.emit('ice-candidate', {
          roomId,
          candidate: event.candidate
        });
      }
    };

    peerConnectionRef.current.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
        setIsConnected(true);
      }
    };

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        peerConnectionRef.current?.addTrack(track, localStreamRef.current!);
      });
    }
  };

  const createOffer = async () => {
    if (!peerConnectionRef.current || !socket) return;

    try {
      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);
      
      socket.emit('video-offer', {
        roomId,
        offer,
        userId: user?.uid
      });
    } catch (error) {
      console.error('Error creating offer:', error);
    }
  };

  const handleVideoOffer = async (data: { offer: RTCSessionDescriptionInit; userId: string }) => {
    if (!peerConnectionRef.current || !socket || data.userId === user?.uid) return;

    try {
      await peerConnectionRef.current.setRemoteDescription(data.offer);
      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);
      
      socket.emit('video-answer', {
        roomId,
        answer,
        userId: user?.uid
      });
    } catch (error) {
      console.error('Error handling video offer:', error);
    }
  };

  const handleVideoAnswer = async (data: { answer: RTCSessionDescriptionInit; userId: string }) => {
    if (!peerConnectionRef.current || data.userId === user?.uid) return;

    try {
      await peerConnectionRef.current.setRemoteDescription(data.answer);
    } catch (error) {
      console.error('Error handling video answer:', error);
    }
  };

  const handleIceCandidate = async (data: { candidate: RTCIceCandidateInit }) => {
    if (!peerConnectionRef.current) return;

    try {
      await peerConnectionRef.current.addIceCandidate(data.candidate);
    } catch (error) {
      console.error('Error handling ICE candidate:', error);
    }
  };

  const handleUserLeftVideo = () => {
    setIsConnected(false);
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };

  const endCall = () => {
    cleanup();
    socket?.emit('leave-video', { roomId, userId: user?.uid });
    onClose();
  };

  const cleanup = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 2, position: 'fixed', top: 20, right: 20, width: 400, zIndex: 1000 }}>
      <Typography variant="h6" gutterBottom>
        Video Call
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="caption">You</Typography>
          <video
            ref={localVideoRef}
            autoPlay
            muted
            style={{ width: '100%', height: 120, backgroundColor: '#000' }}
          />
        </Box>
        
        {isConnected && (
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption">Remote</Typography>
            <video
              ref={remoteVideoRef}
              autoPlay
              style={{ width: '100%', height: 120, backgroundColor: '#000' }}
            />
          </Box>
        )}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
        <IconButton
          onClick={toggleVideo}
          color={isVideoEnabled ? 'primary' : 'error'}
        >
          {isVideoEnabled ? <Videocam /> : <VideocamOff />}
        </IconButton>
        
        <IconButton
          onClick={toggleAudio}
          color={isAudioEnabled ? 'primary' : 'error'}
        >
          {isAudioEnabled ? <Mic /> : <MicOff />}
        </IconButton>
        
        <IconButton onClick={createOffer} color="primary">
          <Videocam />
        </IconButton>
        
        <IconButton onClick={endCall} color="error">
          <CallEnd />
        </IconButton>
      </Box>
    </Paper>
  );
};