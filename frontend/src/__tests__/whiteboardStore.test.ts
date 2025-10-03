import { useWhiteboardStore, type DrawingData } from '../stores/whiteboardStore'

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

  it('should set drawing state', () => {
    useWhiteboardStore.getState().setIsDrawing(true)
    expect(useWhiteboardStore.getState().isDrawing).toBe(true)
  })

  it('should change tool', () => {
    useWhiteboardStore.getState().setCurrentTool('eraser')
    expect(useWhiteboardStore.getState().currentTool).toBe('eraser')
  })

  it('should add drawing correctly', () => {
    const drawing: DrawingData = {
      x: 100,
      y: 100,
      color: '#FF0000',
      size: 10,
      tool: 'brush'
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

  it('should set drawings array', () => {
    const drawings: DrawingData[] = [
      { x: 100, y: 100, color: '#000000', size: 5, tool: 'brush' },
      { x: 200, y: 200, color: '#FF0000', size: 10, tool: 'eraser' }
    ]
    
    useWhiteboardStore.getState().setDrawings(drawings)
    expect(useWhiteboardStore.getState().drawings).toEqual(drawings)
  })

  it('should set active users', () => {
    const users = [
      { id: '1', name: 'User 1', role: 'admin' },
      { id: '2', name: 'User 2', role: 'editor' }
    ]
    
    useWhiteboardStore.getState().setActiveUsers(users)
    expect(useWhiteboardStore.getState().activeUsers).toEqual(users)
  })

  it('should clear canvas', () => {
    const drawing: DrawingData = {
      x: 100,
      y: 100,
      color: '#FF0000',
      size: 10,
      tool: 'brush'
    }

    useWhiteboardStore.getState().addDrawing(drawing)
    useWhiteboardStore.getState().clearCanvas()
    expect(useWhiteboardStore.getState().drawings).toHaveLength(0)
  })
})