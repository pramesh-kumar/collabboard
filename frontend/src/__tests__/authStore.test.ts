import { useAuthStore } from '../stores/authStore'

describe('AuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      role: 'viewer',
      loading: true
    })
  })

  it('should set user correctly', () => {
    const mockUser = {
      uid: '123',
      email: 'test@example.com',
      displayName: 'Test User'
    } as any

    useAuthStore.getState().setUser(mockUser)
    
    expect(useAuthStore.getState().user).toEqual(mockUser)
  })

  it('should set role correctly', () => {
    useAuthStore.getState().setRole('admin')
    
    expect(useAuthStore.getState().role).toBe('admin')
  })

  it('should set loading state correctly', () => {
    useAuthStore.getState().setLoading(false)
    
    expect(useAuthStore.getState().loading).toBe(false)
  })
})