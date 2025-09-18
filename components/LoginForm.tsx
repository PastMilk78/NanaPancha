'use client'

import { useState } from 'react'

export default function LoginForm() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  })

  console.log('LoginForm renderizando')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Formulario enviado:', credentials)
    alert(`Login con: ${credentials.username}`)
  }

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">
          🍕 Mesero Nana - Login
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Usuario
            </label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="admin123"
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Iniciar Sesión
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
