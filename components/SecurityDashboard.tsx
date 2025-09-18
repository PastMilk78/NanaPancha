'use client'

import { useState } from 'react'
import { Shield, Eye, AlertTriangle, CheckCircle, Clock, MapPin, User, Activity } from 'lucide-react'

export default function SecurityDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'audit' | 'attempts'>('overview')

  // Log para debugging
  console.log('SecurityDashboard renderizando, activeTab:', activeTab)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Shield className="h-8 w-8 text-indigo-600 mr-3" />
          Panel de Seguridad
        </h1>
        <p className="mt-2 text-gray-600">
          Monitorea la actividad del sistema y detecta amenazas de seguridad
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', name: 'Resumen', icon: Eye },
            { id: 'audit', name: 'Auditoría', icon: Shield },
            { id: 'attempts', name: 'Intentos de Login', icon: Activity }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Contenido de las tabs */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Estadísticas principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Activity className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Intentos (24h)</p>
                  <p className="text-2xl font-semibold text-gray-900">45</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Intentos Fallidos</p>
                  <p className="text-2xl font-semibold text-gray-900">12</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Tasa de Éxito</p>
                  <p className="text-2xl font-semibold text-gray-900">73.3%</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Shield className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">IPs Sospechosas</p>
                  <p className="text-2xl font-semibold text-gray-900">3</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actividad reciente */}
          <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Actividad Reciente</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        admin - login
                      </p>
                      <p className="text-xs text-gray-500 flex items-center space-x-2">
                        <MapPin className="h-3 w-3" />
                        <span>192.168.1.100</span>
                        <span>•</span>
                        <span>Hace 30 min</span>
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Exitoso
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'audit' && (
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Logs de Auditoría</h3>
          </div>
          <div className="p-6">
            <p className="text-gray-600">Aquí se mostrarán los logs de auditoría del sistema.</p>
          </div>
        </div>
      )}

      {activeTab === 'attempts' && (
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Intentos de Login</h3>
          </div>
          <div className="p-6">
            <p className="text-gray-600">Aquí se mostrarán los intentos de login del sistema.</p>
          </div>
        </div>
      )}
    </div>
  )
}
