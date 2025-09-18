'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, Clock, Package, XCircle, Phone, MessageSquare, User, Globe, RefreshCw, ChefHat, Database } from 'lucide-react'
import ProtectedRoute from '@/components/ProtectedRoute'
import { Order } from '@/types'
import { useOrders } from '@/hooks/useOrders'
import Image from 'next/image'

export default function Home() {
  const { orders, updateOrder, deleteOrder } = useOrders()
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  // Calcular estadísticas de órdenes
  const stats = {
    pending: orders.filter(o => o.status === 'pendiente').length,
    inPreparation: orders.filter(o => o.status === 'en_preparacion').length,
    ready: orders.filter(o => o.status === 'listo').length,
    delivered: orders.filter(o => o.status === 'entregado').length
  }

  // Función para obtener el icono de la fuente
  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'whatsapp': return <MessageSquare className="h-4 w-4 text-white" />
      case 'telefono': return <Phone className="h-4 w-4 text-black" />
      case 'interno': return <User className="h-4 w-4 text-white" />
      case 'web': return <Globe className="h-4 w-4 text-white" />
      default: return <User className="h-4 w-4 text-white" />
    }
  }

  // Función para obtener el nombre de la fuente
  const getSourceName = (source: string) => {
    switch (source) {
      case 'whatsapp': return 'WhatsApp'
      case 'telefono': return 'Teléfono'
      case 'interno': return 'Interno'
      case 'web': return 'Web'
      default: return 'Desconocido'
    }
  }

  // Función para obtener el color de fondo de la fuente
  const getSourceBgColor = (source: string) => {
    switch (source) {
      case 'whatsapp': return 'bg-red-500'
      case 'telefono': return 'bg-yellow-400'
      case 'interno': return 'bg-red-500'
      case 'web': return 'bg-red-500'
      default: return 'bg-red-500'
    }
  }

  // Función para obtener el color del texto de la fuente
  const getSourceTextColor = (source: string) => {
    switch (source) {
      case 'whatsapp': return 'text-white'
      case 'telefono': return 'text-black'
      case 'interno': return 'text-white'
      case 'web': return 'text-white'
      default: return 'text-white'
    }
  }

  // Función para actualizar el estado de una orden
  const updateOrderStatus = (orderId: string, newStatus: string) => {
    updateOrder(orderId, { 
      status: newStatus as any,
      updatedAt: new Date()
    })
  }

  // Función para formatear la hora
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  // Función para formatear el precio
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price)
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        {/* Header Negro */}
        <header className="bg-black text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              {/* Logo y Título */}
              <div className="flex items-center space-x-4">
                {/* Logo NanaPancha */}
                <div className="relative">
                  <Image 
                    src="/logo.svg" 
                    alt="NanaPancha Logo" 
                    width={64} 
                    height={64}
                    className="w-16 h-16"
                  />
                </div>
                
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    Panel de Órdenes
                  </h1>
                  <p className="text-white text-sm">
                    Sistema de gestión NanaPancha
                  </p>
                </div>
              </div>

              {/* Botón Actualizar */}
              <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors">
                <RefreshCw className="h-4 w-4" />
                <span>Actualizar</span>
              </button>
            </div>
          </div>
        </header>

        {/* Navegación Principal */}
        <nav className="bg-black border-b border-gray-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex">
              <button className="bg-red-500 text-white px-6 py-4 flex items-center space-x-2 border-b-2 border-red-500">
                <ChefHat className="h-5 w-5" />
                <span>Gestión de Órdenes</span>
              </button>
              <button className="bg-black text-white px-6 py-4 flex items-center space-x-2 hover:bg-gray-800">
                <Database className="h-5 w-5" />
                <span>Base de Datos</span>
              </button>
            </div>
          </div>
        </nav>

        {/* Contenido Principal */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Grid de Órdenes */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Por Confirmar */}
            <div className="space-y-4">
              <div className="bg-yellow-100 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-yellow-600" />
                    <h2 className="text-lg font-semibold text-black">Por Confirmar</h2>
                  </div>
                  <span className="bg-yellow-600 text-white text-sm font-medium px-2 py-1 rounded-full">
                    {stats.pending}
                  </span>
                </div>
              </div>
              
              <div className="space-y-4">
                {orders.filter(order => order.status === 'pendiente').map((order) => (
                  <div key={order.id} className="bg-white rounded-lg shadow-md border-l-4 border-red-500 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-black text-lg">{order.customerInfo.name}</h3>
                      <div className={`px-2 py-1 rounded text-xs font-medium ${getSourceBgColor(order.source)} ${getSourceTextColor(order.source)}`}>
                        {getSourceName(order.source)}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-gray-600 mb-2">
                      <Phone className="h-4 w-4" />
                      <span className="text-sm">{order.customerInfo.phone}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-gray-600 mb-4">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">{formatTime(order.createdAt)}</span>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-bold text-black mb-2">Productos:</h4>
                      <div className="space-y-1">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <div className="flex items-center space-x-2">
                              <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                {item.quantity}
                              </span>
                              <span>{item.name}</span>
                            </div>
                            <span className="font-semibold">{formatPrice(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-3 mb-4">
                      <div className="flex justify-between">
                        <span className="font-bold text-black">Total:</span>
                        <span className="font-bold text-red-500 text-lg">{formatPrice(order.total)}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 mb-3">
                      <button 
                        onClick={() => updateOrderStatus(order.id, 'en_preparacion')}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span>Aceptar</span>
                      </button>
                      <button 
                        onClick={() => updateOrderStatus(order.id, 'cancelado')}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg transition-colors"
                      >
                        Rechazo Manual
                      </button>
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      Navegación rápida: <span className="text-red-500 cursor-pointer hover:underline">A Cocina</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* En Cocina */}
            <div className="space-y-4">
              <div className="bg-yellow-100 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ChefHat className="h-5 w-5 text-yellow-600" />
                    <h2 className="text-lg font-semibold text-black">En Cocina</h2>
                  </div>
                  <span className="bg-yellow-600 text-white text-sm font-medium px-2 py-1 rounded-full">
                    {stats.inPreparation}
                  </span>
                </div>
              </div>
              
              <div className="space-y-4">
                {orders.filter(order => order.status === 'en_preparacion').map((order) => (
                  <div key={order.id} className="bg-white rounded-lg shadow-md border-l-4 border-red-500 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-black text-lg">{order.customerInfo.name}</h3>
                      <div className={`px-2 py-1 rounded text-xs font-medium ${getSourceBgColor(order.source)} ${getSourceTextColor(order.source)}`}>
                        {getSourceName(order.source)}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-gray-600 mb-2">
                      <Phone className="h-4 w-4" />
                      <span className="text-sm">{order.customerInfo.phone}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-gray-600 mb-4">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">{formatTime(order.createdAt)}</span>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-bold text-black mb-2">Productos:</h4>
                      <div className="space-y-1">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <div className="flex items-center space-x-2">
                              <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                {item.quantity}
                              </span>
                              <span>{item.name}</span>
                            </div>
                            <span className="font-semibold">{formatPrice(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-3 mb-4">
                      <div className="flex justify-between">
                        <span className="font-bold text-black">Total:</span>
                        <span className="font-bold text-red-500 text-lg">{formatPrice(order.total)}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 mb-3">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                      >
                        <span>Modificar</span>
                      </button>
                      <button 
                        onClick={() => updateOrderStatus(order.id, 'listo')}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span>Marcar Listo</span>
                      </button>
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      Navegación rápida: <span className="text-red-500 cursor-pointer hover:underline">A Confirmar</span> | <span className="text-red-500 cursor-pointer hover:underline">Listo</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Para Entrega */}
            <div className="space-y-4">
              <div className="bg-green-100 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Package className="h-5 w-5 text-green-600" />
                    <h2 className="text-lg font-semibold text-black">Para Entrega</h2>
                  </div>
                  <span className="bg-green-600 text-white text-sm font-medium px-2 py-1 rounded-full">
                    {stats.ready}
                  </span>
                </div>
              </div>
              
              <div className="space-y-4">
                {orders.filter(order => order.status === 'listo').map((order) => (
                  <div key={order.id} className="bg-white rounded-lg shadow-md border-l-4 border-red-500 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-black text-lg">{order.customerInfo.name}</h3>
                      <div className={`px-2 py-1 rounded text-xs font-medium ${getSourceBgColor(order.source)} ${getSourceTextColor(order.source)}`}>
                        {getSourceName(order.source)}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-gray-600 mb-2">
                      <Phone className="h-4 w-4" />
                      <span className="text-sm">{order.customerInfo.phone}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-gray-600 mb-4">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">{formatTime(order.createdAt)}</span>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-bold text-black mb-2">Productos:</h4>
                      <div className="space-y-1">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <div className="flex items-center space-x-2">
                              <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                {item.quantity}
                              </span>
                              <span>{item.name}</span>
                            </div>
                            <span className="font-semibold">{formatPrice(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-3 mb-4">
                      <div className="flex justify-between">
                        <span className="font-bold text-black">Total:</span>
                        <span className="font-bold text-red-500 text-lg">{formatPrice(order.total)}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 mb-3">
                      <button 
                        onClick={() => updateOrderStatus(order.id, 'entregado')}
                        className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                      >
                        <Package className="h-4 w-4" />
                        <span>Archivar</span>
                      </button>
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      Navegación rápida: <span className="text-red-500 cursor-pointer hover:underline">A Cocina</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}