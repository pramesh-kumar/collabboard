import { auth, googleProvider } from '../utils/firebase'

describe('Firebase Utils', () => {
  it('should initialize auth correctly', () => {
    expect(auth).toBeDefined()
    expect(auth.app).toBeDefined()
  })

  it('should initialize Google provider correctly', () => {
    expect(googleProvider).toBeDefined()
    expect(googleProvider.providerId).toBe('google.com')
  })
})

// Helper function tests
describe('Helper Functions', () => {
  describe('generateRoomId', () => {
    const generateRoomId = () => Math.random().toString(36).substring(2, 15)
    
    it('should generate unique room IDs', () => {
      const id1 = generateRoomId()
      const id2 = generateRoomId()
      
      expect(id1).not.toBe(id2)
      expect(id1.length).toBeGreaterThan(0)
      expect(id2.length).toBeGreaterThan(0)
    })
  })

  describe('validateRoomId', () => {
    const validateRoomId = (roomId: string) => {
      return roomId && roomId.trim().length > 0
    }
    
    it('should validate room ID correctly', () => {
      expect(validateRoomId('valid-room-id')).toBe(true)
      expect(validateRoomId('')).toBe(false)
      expect(validateRoomId('   ')).toBe(false)
    })
  })

  describe('formatTimestamp', () => {
    const formatTimestamp = (timestamp: number) => {
      return new Date(timestamp).toLocaleTimeString()
    }
    
    it('should format timestamp correctly', () => {
      const timestamp = Date.now()
      const formatted = formatTimestamp(timestamp)
      
      expect(formatted).toMatch(/\d{1,2}:\d{2}:\d{2}/)
    })
  })
})