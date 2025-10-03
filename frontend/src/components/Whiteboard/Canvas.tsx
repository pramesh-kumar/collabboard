import React, { useRef, useEffect, useCallback } from 'react';
import { Box } from '@mui/material';
import { useWhiteboardStore, type DrawingData } from '../../stores/whiteboardStore';
import { useSocket } from '../../hooks/useSocket';

interface CanvasProps {
  roomId: string;
}

export const Canvas: React.FC<CanvasProps> = ({ roomId }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    isDrawing,
    currentTool,
    brushColor,
    brushSize,
    drawings,
    setIsDrawing,
    addDrawing,
    setDrawings
  } = useWhiteboardStore();
  const socket = useSocket(roomId);

  const draw = useCallback((drawingData: DrawingData) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.globalCompositeOperation = drawingData.tool === 'eraser' ? 'destination-out' : 'source-over';
    ctx.strokeStyle = drawingData.color;
    ctx.lineWidth = drawingData.size;
    ctx.lineCap = 'round';

    if (drawingData.prevX !== undefined && drawingData.prevY !== undefined) {
      ctx.beginPath();
      ctx.moveTo(drawingData.prevX, drawingData.prevY);
      ctx.lineTo(drawingData.x, drawingData.y);
      ctx.stroke();
    }
  }, []);

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const pos = getMousePos(e);
    const drawingData: DrawingData = {
      x: pos.x,
      y: pos.y,
      color: brushColor,
      size: brushSize,
      tool: currentTool
    };
    
    console.log('Drawing started:', drawingData);
    addDrawing(drawingData);
    draw(drawingData);
    socket?.emit('drawing', drawingData);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const pos = getMousePos(e);
    const lastDrawing = drawings[drawings.length - 1];
    
    const drawingData: DrawingData = {
      x: pos.x,
      y: pos.y,
      prevX: lastDrawing?.x,
      prevY: lastDrawing?.y,
      color: brushColor,
      size: brushSize,
      tool: currentTool
    };

    addDrawing(drawingData);
    draw(drawingData);
    socket?.emit('drawing', drawingData);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  useEffect(() => {
    if (!socket) return;

    console.log('Setting up canvas socket listeners...');

    socket.on('drawing', (drawingData: DrawingData) => {
      console.log('Received drawing:', drawingData);
      draw(drawingData);
      addDrawing(drawingData);
    });

    socket.on('canvas-state', (canvasDrawings: DrawingData[]) => {
      setDrawings(canvasDrawings);
      // Redraw canvas
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          canvasDrawings.forEach(draw);
        }
      }
    });

    socket.on('canvas-cleared', () => {
      console.log('Canvas cleared event received');
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
      setDrawings([]);
    });

    return () => {
      socket.off('drawing');
      socket.off('canvas-state');
      socket.off('canvas-cleared');
    };
  }, [socket, draw, addDrawing, setDrawings]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
  }, []);

  return (
    <Box sx={{ flexGrow: 1, height: '100%' }}>
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          cursor: currentTool === 'brush' ? 'crosshair' : 'grab',
          border: '1px solid #ccc'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
    </Box>
  );
};