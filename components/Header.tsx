'use client'

import { useState } from 'react'
import { User, LogOut, Settings, Shield, Activity, BarChart3, Home } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export default function Header() {
  const { user, logout, isAdmin } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logout()
      // Redirigir a la página de login
      window.location.href = '/login'
    } catch (error) {
      console.error('Error en logout:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  // Si no hay usuario, mostrar header básico
  if (!user) {
    return (
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-gray-900">
                  🍕 Mesero Nana
                </h1>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-500">Cargando...</span>
            </div>
          </div>
        </div>
      </header>
    )
  }

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrador'
      case 'mesero':
        return 'Mesero'
      case 'cocinero':
        return 'Cocinero'
      default:
        return role
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'mesero':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'cocinero':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <header className="bg-white shadow-lg border-b border-primary-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo y título */}
          <div className="flex items-center space-x-6">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-primary-700">
                🍕 Mesero Nana
              </h1>
            </div>
            
            {/* Navegación */}
            <nav className="hidden md:flex space-x-4">
              <button
                onClick={() => window.location.href = '/'}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-100 rounded-lg transition-colors border border-primary-200"
              >
                <Home className="h-4 w-4" />
                <span>Menú</span>
              </button>
              
              {(user.role === 'admin' || user.role === 'cocinero') && (
                <button
                  onClick={() => window.location.href = '/admin'}
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-100 rounded-lg transition-colors border border-primary-200"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>Dashboard</span>
                </button>
              )}
            </nav>
          </div>

          {/* Información del usuario */}
          <div className="flex items-center space-x-4">
            {/* Indicador de actividad */}
            <div className="flex items-center space-x-2 text-sm text-primary-600">
              <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
              <span>Conectado</span>
            </div>

            {/* Información del usuario */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-primary-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">{user.username}</p>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                    {getRoleDisplayName(user.role)}
                  </span>
                </div>
              </button>

              {/* Menú desplegable */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                  <div className="py-1">
                    {/* Información del usuario */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user.username}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <div className="mt-2 flex items-center space-x-2 text-xs text-gray-500">
                        <Shield className="h-3 w-3" />
                        <span>Último acceso: {user.lastLoginIP || 'N/A'}</span>
                      </div>
                      {user.lastLoginAt && (
                        <div className="mt-1 flex items-center space-x-2 text-xs text-gray-500">
                          <Activity className="h-3 w-3" />
                          <span>{new Date(user.lastLoginAt).toLocaleString('es-ES')}</span>
                        </div>
                      )}
                    </div>

                    {/* Opciones del menú */}
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setShowUserMenu(false)
                          window.location.href = '/'
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                      >
                        <Home className="h-4 w-4" />
                        <span>Menú Principal</span>
                      </button>
                      
                      {(user.role === 'admin' || user.role === 'cocinero') && (
                        <button
                          onClick={() => {
                            setShowUserMenu(false)
                            window.location.href = '/admin'
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                        >
                          <BarChart3 className="h-4 w-4" />
                          <span>Dashboard de Comandas</span>
                        </button>
                      )}
                      
                      {isAdmin() && (
                        <button
                          onClick={() => {
                            setShowUserMenu(false)
                            window.location.href = '/security'
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                        >
                          <Settings className="h-4 w-4" />
                          <span>Panel de Seguridad</span>
                        </button>
                      )}
                      
                      <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 flex items-center space-x-2 disabled:opacity-50"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>
                          {isLoggingOut ? 'Cerrando sesión...' : 'Cerrar Sesión'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay para cerrar el menú al hacer clic fuera */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </header>
  )
}
