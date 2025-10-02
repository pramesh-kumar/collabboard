import { useWhiteboardStore } from '../stores/whiteboardStore'

describe('WhiteboardStore', () => {
  beforeEach(() => {
    useWhiteboardStore.setState({
      isDrawing: false,
      currentTool: 'brush',
      brushColor: '#000000',
      brushSize: 5,
      drawings: [],
      activeUsers: []
    })
  })

  it('should add drawing correctly', () => {
    const drawing = {
      x: 100,
      y: 100,
      color: '#FF0000',
      size: 10,
      tool: 'brush' as const
    }

    useWhiteboardStore.getState().addDrawing(drawing)
    
    expect(useWhiteboardStore.getState().drawings).toContain(drawing)
  })

  it('should change brush color', () => {
    useWhiteboardStore.getState().setBrushColor('#FF0000')
    
    expect(useWhiteboardStore.getState().brushColor).toBe('#FF0000')
  })

  it('should change brush size', () => {
    useWhiteboardStore.getState().setBrushSize(15)
    
    expect(useWhiteboardStore.getState().brushSize).toBe(15)
  })

  it('should clear canvas', () => {
    const drawing = {
      x: 100,
      y: 100,
      color: '#FF0000',
      size: 10,
      tool: 'brush' as const
    }

    useWhiteboardStore.getState().addDrawing(drawing)
    useWhiteboardStore.getState().clearCanvas()
    
    expect(useWhiteboardStore.getState().drawings).toHaveLength(0)
  })
})