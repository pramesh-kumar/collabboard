import { create } from 'zustand';

export interface DrawingData {
  x: number;
  y: number;
  prevX?: number;
  prevY?: number;
  color: string;
  size: number;
  tool: 'brush' | 'eraser';
}

interface WhiteboardState {
  isDrawing: boolean;
  currentTool: 'brush' | 'eraser';
  brushColor: string;
  brushSize: number;
  drawings: DrawingData[];
  activeUsers: Array<{ id: string; name: string; role: string }>;
  setIsDrawing: (drawing: boolean) => void;
  setCurrentTool: (tool: 'brush' | 'eraser') => void;
  setBrushColor: (color: string) => void;
  setBrushSize: (size: number) => void;
  addDrawing: (drawing: DrawingData) => void;
  setDrawings: (drawings: DrawingData[]) => void;
  setActiveUsers: (users: Array<{ id: string; name: string; role: string }>) => void;
  clearCanvas: () => void;
}

export const useWhiteboardStore = create<WhiteboardState>((set) => ({
  isDrawing: false,
  currentTool: 'brush',
  brushColor: '#000000',
  brushSize: 5,
  drawings: [],
  activeUsers: [],
  setIsDrawing: (isDrawing) => set({ isDrawing }),
  setCurrentTool: (currentTool) => set({ currentTool }),
  setBrushColor: (brushColor) => set({ brushColor }),
  setBrushSize: (brushSize) => set({ brushSize }),
  addDrawing: (drawing) => set((state) => ({ drawings: [...state.drawings, drawing] })),
  setDrawings: (drawings) => set({ drawings }),
  setActiveUsers: (activeUsers) => set({ activeUsers }),
  clearCanvas: () => set({ drawings: [] }),
}));