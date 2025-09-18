import { useState, useEffect, useCallback } from 'react'
import { User, LoginCredentials, AuthResponse } from '@/types/auth'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true
  })

  // Verificar token al cargar
  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (token) {
      // En un caso real, aquí verificarías el token con el backend
      const userData = localStorage.getItem('userData')
      if (userData) {
        try {
          const user = JSON.parse(userData)
          setAuthState({
            user,
            token,
            isAuthenticated: true,
            isLoading: false
          })
        } catch (error) {
          console.error('Error parsing user data:', error)
          localStorage.removeItem('authToken')
          localStorage.removeItem('userData')
          setAuthState({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false
          })
        }
      } else {
        setAuthState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false
        })
      }
    } else {
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false
      })
    }
  }, [])

  // Función para obtener IP del cliente
  const getClientIP = useCallback(async (): Promise<string> => {
    try {
      // Usar un servicio externo para obtener la IP real
      const response = await fetch('https://api.ipify.org?format=json')
      const data = await response.json()
      return data.ip
    } catch (error) {
      console.error('Error obteniendo IP:', error)
      return 'unknown'
    }
  }, [])

  // Función para obtener User Agent
  const getUserAgent = useCallback((): string => {
    return navigator.userAgent || 'unknown'
  }, [])

  // Función de login
  const login = useCallback(async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }))
      
      const ip = await getClientIP()
      const userAgent = getUserAgent()
      
      // En un caso real, aquí harías la llamada al backend
      // Por ahora simulamos la respuesta
      const mockResponse: AuthResponse = {
        success: true,
        message: 'Login exitoso',
        token: 'mock-jwt-token-' + Date.now(),
        user: {
          id: '1',
          username: credentials.username,
          email: `${credentials.username}@mesero-nana.com`,
          role: credentials.username === 'admin' ? 'admin' : 'mesero',
          isActive: true,
          createdAt: new Date(),
          lastLoginAt: new Date(),
          lastLoginIP: ip
        }
      }
      
      if (mockResponse.success && mockResponse.token && mockResponse.user) {
        // Guardar en localStorage
        localStorage.setItem('authToken', mockResponse.token)
        localStorage.setItem('userData', JSON.stringify(mockResponse.user))
        
        setAuthState({
          user: mockResponse.user,
          token: mockResponse.token,
          isAuthenticated: true,
          isLoading: false
        })
        
        // Log de auditoría (en un caso real esto se haría en el backend)
        console.log(`Login exitoso para ${credentials.username} desde IP: ${ip}`)
      }
      
      return mockResponse
    } catch (error) {
      console.error('Error en login:', error)
      setAuthState(prev => ({ ...prev, isLoading: false }))
      return {
        success: false,
        message: 'Error interno del cliente'
      }
    }
  }, [getClientIP, getUserAgent])

  // Función de logout
  const logout = useCallback(async (): Promise<void> => {
    try {
      const token = localStorage.getItem('authToken')
      const ip = await getClientIP()
      const userAgent = getUserAgent()
      
      // En un caso real, aquí notificarías al backend
      if (token) {
        console.log(`Logout desde IP: ${ip}`)
      }
      
      // Limpiar localStorage
      localStorage.removeItem('authToken')
      localStorage.removeItem('userData')
      
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false
      })
    } catch (error) {
      console.error('Error en logout:', error)
    }
  }, [getClientIP, getUserAgent])

  // Función para verificar si el usuario tiene un rol específico
  const hasRole = useCallback((role: string | string[]): boolean => {
    if (!authState.user) return false
    
    if (Array.isArray(role)) {
      return role.includes(authState.user.role)
    }
    
    return authState.user.role === role
  }, [authState.user])

  // Función para verificar si el usuario es admin
  const isAdmin = useCallback((): boolean => {
    return hasRole('admin')
  }, [hasRole])

  return {
    ...authState,
    login,
    logout,
    hasRole,
    isAdmin
  }
}







