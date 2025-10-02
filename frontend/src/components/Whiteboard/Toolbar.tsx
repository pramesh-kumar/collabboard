import React from 'react';
import {
  Box,
  IconButton,
  Slider,
  Typography,
  Paper,
  Divider,
  Button
} from '@mui/material';
import {
  Brush,
  Clear,
  Delete
} from '@mui/icons-material';
import { useWhiteboardStore } from '../../stores/whiteboardStore';

const colors = ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];

export const Toolbar: React.FC = () => {
  const {
    currentTool,
    brushColor,
    brushSize,
    setCurrentTool,
    setBrushColor,
    setBrushSize,
    clearCanvas
  } = useWhiteboardStore();

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
      <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
        <Box display="flex" gap={1}>
          <IconButton
            color={currentTool === 'brush' ? 'primary' : 'default'}
            onClick={() => setCurrentTool('brush')}
          >
            <Brush />
          </IconButton>
          <IconButton
            color={currentTool === 'eraser' ? 'primary' : 'default'}
            onClick={() => setCurrentTool('eraser')}
          >
            <Clear />
          </IconButton>
        </Box>

        <Divider orientation="vertical" flexItem />

        <Box display="flex" gap={1}>
          {colors.map((color) => (
            <Box
              key={color}
              sx={{
                width: 30,
                height: 30,
                backgroundColor: color,
                border: brushColor === color ? '3px solid #333' : '1px solid #ccc',
                borderRadius: '50%',
                cursor: 'pointer'
              }}
              onClick={() => setBrushColor(color)}
            />
          ))}
        </Box>

        <Divider orientation="vertical" flexItem />

        <Box display="flex" alignItems="center" gap={2} minWidth={150}>
          <Typography variant="body2">Size:</Typography>
          <Slider
            value={brushSize}
            onChange={(_, value) => setBrushSize(value as number)}
            min={1}
            max={20}
            size="small"
          />
          <Typography variant="body2">{brushSize}</Typography>
        </Box>

        <Divider orientation="vertical" flexItem />

        <Button
          variant="outlined"
          startIcon={<Delete />}
          onClick={clearCanvas}
          color="error"
        >
          Clear
        </Button>
      </Box>
    </Paper>
  );
};