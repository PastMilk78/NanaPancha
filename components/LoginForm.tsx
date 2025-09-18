'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'

export default function LoginForm() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      const response = await login(credentials)
      
      if (response.success) {
        // Redirigir al dashboard o página principal
        router.push('/')
      } else {
        setError(response.message || 'Error en el login')
      }
    } catch (error) {
      console.error('Error en login:', error)
      setError('Error interno del servidor')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-black border-2 border-red-500 rounded-lg flex items-center justify-center mx-auto mb-4">
            <div className="text-center">
              <div className="text-white font-bold text-sm">Nana</div>
              <div className="text-white font-bold text-sm">Pancha</div>
              <div className="text-red-500 text-xs">PIZZERIA</div>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Panel de Órdenes - Login
          </h1>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Usuario
            </label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
              className="input-field"
              placeholder="admin"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              className="input-field"
              placeholder="admin123"
            />
          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-3 text-lg rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
        
        <div className="mt-6 p-4 bg-gray-100 rounded-md">
          <h3 className="font-medium text-gray-800 mb-2">Credenciales de Prueba:</h3>
          <p className="text-sm text-gray-600">Usuario: admin, Contraseña: admin123</p>
        </div>
      </div>
    </div>
  )
}
