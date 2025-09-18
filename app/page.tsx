'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, Clock, Package, XCircle, Phone, MessageSquare, User, Globe, RefreshCw } from 'lucide-react'
import Header from '@/components/Header'
import ProtectedRoute from '@/components/ProtectedRoute'
import { Order } from '@/types'
import { useOrders } from '@/hooks/useOrders'

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
      case 'whatsapp': return <MessageSquare className="h-4 w-4 text-green-500" />
      case 'telefono': return <Phone className="h-4 w-4 text-blue-500" />
      case 'interno': return <User className="h-4 w-4 text-purple-500" />
      case 'web': return <Globe className="h-4 w-4 text-indigo-500" />
      default: return <User className="h-4 w-4 text-gray-500" />
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
      <div className="min-h-screen bg-primary-50">
        {/* Header con autenticación */}
        <Header />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header del Panel */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-primary-800 mb-2">
                  Panel de Órdenes
                </h1>
                <p className="text-primary-600">
                  Sistema de gestión NanaPancha
                </p>
              </div>
              <button className="btn-primary flex items-center space-x-2">
                <RefreshCw className="h-4 w-4" />
                <span>Actualizar</span>
              </button>
            </div>
          </div>

          {/* Navegación */}
          <div className="mb-6">
            <nav className="flex space-x-4">
              <button className="px-4 py-2 text-sm font-medium text-primary-600 border-b-2 border-primary-500">
                Gestión de Órdenes
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-primary-600">
                Base de Datos
              </button>
            </nav>
          </div>

          {/* Grid de Órdenes */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Por Confirmar */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Por Confirmar</h2>
                <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-2 py-1 rounded-full">
                  {stats.pending}
                </span>
              </div>
              
              <div className="space-y-4">
                {orders.filter(order => order.status === 'pendiente').map((order) => (
                  <div key={order.id} className="card">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">{order.customerInfo.name}</h3>
                      <div className="flex items-center space-x-2">
                        {getSourceIcon(order.source)}
                        <span className="text-sm text-gray-500">{getSourceName(order.source)}</span>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-2">
                      {order.customerInfo.phone}
                    </div>
                    
                    <div className="text-sm text-gray-500 mb-3">
                      {formatTime(order.createdAt)}
                    </div>
                    
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Productos:</h4>
                      <div className="space-y-1">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span>{item.quantity}{item.name}</span>
                            <span>{formatPrice(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-3 mb-4">
                      <div className="flex justify-between font-semibold">
                        <span>Total:</span>
                        <span>{formatPrice(order.total)}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 mb-3">
                      <button 
                        onClick={() => updateOrderStatus(order.id, 'en_preparacion')}
                        className="flex-1 btn-primary text-sm py-2"
                      >
                        Aceptar
                      </button>
                      <button 
                        onClick={() => updateOrderStatus(order.id, 'cancelado')}
                        className="flex-1 btn-secondary text-sm py-2"
                      >
                        Rechazo Manual
                      </button>
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      Navegación rápida: <span className="text-primary-600 cursor-pointer">A Cocina</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* En Cocina */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">En Cocina</h2>
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded-full">
                  {stats.inPreparation}
                </span>
              </div>
              
              <div className="space-y-4">
                {orders.filter(order => order.status === 'en_preparacion').map((order) => (
                  <div key={order.id} className="card">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">{order.customerInfo.name}</h3>
                      <div className="flex items-center space-x-2">
                        {getSourceIcon(order.source)}
                        <span className="text-sm text-gray-500">{getSourceName(order.source)}</span>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-2">
                      {order.customerInfo.phone}
                    </div>
                    
                    <div className="text-sm text-gray-500 mb-3">
                      {formatTime(order.createdAt)}
                    </div>
                    
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Productos:</h4>
                      <div className="space-y-1">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span>{item.quantity}{item.name}</span>
                            <span>{formatPrice(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-3 mb-4">
                      <div className="flex justify-between font-semibold">
                        <span>Total:</span>
                        <span>{formatPrice(order.total)}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 mb-3">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="flex-1 btn-secondary text-sm py-2"
                      >
                        Modificar
                      </button>
                      <button 
                        onClick={() => updateOrderStatus(order.id, 'listo')}
                        className="flex-1 btn-primary text-sm py-2"
                      >
                        Marcar Listo
                      </button>
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      Navegación rápida: <span className="text-primary-600 cursor-pointer">A Confirmar</span> | <span className="text-primary-600 cursor-pointer">Listo</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Para Entrega */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Para Entrega</h2>
                <span className="bg-green-100 text-green-800 text-sm font-medium px-2 py-1 rounded-full">
                  {stats.ready}
                </span>
              </div>
              
              <div className="space-y-4">
                {orders.filter(order => order.status === 'listo').map((order) => (
                  <div key={order.id} className="card">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">{order.customerInfo.name}</h3>
                      <div className="flex items-center space-x-2">
                        {getSourceIcon(order.source)}
                        <span className="text-sm text-gray-500">{getSourceName(order.source)}</span>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-2">
                      {order.customerInfo.phone}
                    </div>
                    
                    <div className="text-sm text-gray-500 mb-3">
                      {formatTime(order.createdAt)}
                    </div>
                    
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Productos:</h4>
                      <div className="space-y-1">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span>{item.quantity}{item.name}</span>
                            <span>{formatPrice(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-3 mb-4">
                      <div className="flex justify-between font-semibold">
                        <span>Total:</span>
                        <span>{formatPrice(order.total)}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 mb-3">
                      <button 
                        onClick={() => updateOrderStatus(order.id, 'entregado')}
                        className="w-full btn-primary text-sm py-2"
                      >
                        Archivar
                      </button>
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      Navegación rápida: <span className="text-primary-600 cursor-pointer">A Cocina</span>
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