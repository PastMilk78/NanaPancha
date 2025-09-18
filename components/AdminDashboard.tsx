'use client'

import { useState, useEffect } from 'react'
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  Phone, 
  MessageSquare, 
  User, 
  Globe,
  Filter,
  Search,
  Calendar,
  TrendingUp,
  Package
} from 'lucide-react'
import { Order, OrderFilters, OrderStats } from '@/types'

interface AdminDashboardProps {
  orders: Order[]
  onUpdateOrder: (orderId: string, updates: Partial<Order>) => void
  onDeleteOrder: (orderId: string) => void
}

export default function AdminDashboard({ orders, onUpdateOrder, onDeleteOrder }: AdminDashboardProps) {
  const [filters, setFilters] = useState<OrderFilters>({})
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  // Calcular estadísticas
  const stats: OrderStats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pendiente').length,
    inPreparation: orders.filter(o => o.status === 'en_preparacion').length,
    ready: orders.filter(o => o.status === 'listo').length,
    delivered: orders.filter(o => o.status === 'entregado').length,
    cancelled: orders.filter(o => o.status === 'cancelado').length
  }

  // Filtrar órdenes
  useEffect(() => {
    let filtered = orders

    if (filters.status) {
      filtered = filtered.filter(order => order.status === filters.status)
    }

    if (filters.source) {
      filtered = filtered.filter(order => order.source === filters.source)
    }

    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase()
      filtered = filtered.filter(order => 
        order.orderNumber.toLowerCase().includes(searchLower) ||
        order.customerInfo.name?.toLowerCase().includes(searchLower) ||
        order.customerInfo.phone?.includes(searchLower) ||
        order.items.some(item => item.name.toLowerCase().includes(searchLower))
      )
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(order => order.createdAt >= filters.dateFrom!)
    }

    if (filters.dateTo) {
      filtered = filtered.filter(order => order.createdAt <= filters.dateTo!)
    }

    setFilteredOrders(filtered)
  }, [orders, filters])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pendiente': return <Clock className="h-4 w-4 text-yellow-500" />
      case 'en_preparacion': return <Package className="h-4 w-4 text-blue-500" />
      case 'listo': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'entregado': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'cancelado': return <XCircle className="h-4 w-4 text-red-500" />
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendiente': return 'bg-yellow-100 text-yellow-800'
      case 'en_preparacion': return 'bg-blue-100 text-blue-800'
      case 'listo': return 'bg-green-100 text-green-800'
      case 'entregado': return 'bg-green-100 text-green-800'
      case 'cancelado': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'whatsapp': return <MessageSquare className="h-4 w-4 text-green-500" />
      case 'telefono': return <Phone className="h-4 w-4 text-blue-500" />
      case 'interno': return <User className="h-4 w-4 text-purple-500" />
      case 'web': return <Globe className="h-4 w-4 text-indigo-500" />
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    onUpdateOrder(orderId, { 
      status: newStatus as any,
      updatedAt: new Date()
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard de Administración</h1>
          <p className="text-gray-600">Gestiona todas las comandas de WhatsApp, teléfono e internas</p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">En Preparación</p>
                <p className="text-2xl font-bold text-gray-900">{stats.inPreparation}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Listos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.ready}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Entregados</p>
                <p className="text-2xl font-bold text-gray-900">{stats.delivered}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Cancelados</p>
                <p className="text-2xl font-bold text-gray-900">{stats.cancelled}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <Filter className="h-5 w-5 text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Número, cliente, producto..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={filters.searchTerm || ''}
                  onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={filters.status || ''}
                onChange={(e) => setFilters({...filters, status: e.target.value || undefined})}
              >
                <option value="">Todos los estados</option>
                <option value="pendiente">Pendiente</option>
                <option value="en_preparacion">En Preparación</option>
                <option value="listo">Listo</option>
                <option value="entregado">Entregado</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fuente</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={filters.source || ''}
                onChange={(e) => setFilters({...filters, source: e.target.value || undefined})}
              >
                <option value="">Todas las fuentes</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="telefono">Teléfono</option>
                <option value="interno">Interno</option>
                <option value="web">Web</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Desde</label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={filters.dateFrom ? filters.dateFrom.toISOString().split('T')[0] : ''}
                onChange={(e) => setFilters({...filters, dateFrom: e.target.value ? new Date(e.target.value) : undefined})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hasta</label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={filters.dateTo ? filters.dateTo.toISOString().split('T')[0] : ''}
                onChange={(e) => setFilters({...filters, dateTo: e.target.value ? new Date(e.target.value) : undefined})}
              />
            </div>
          </div>
        </div>

        {/* Lista de órdenes */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Comandas ({filteredOrders.length})
            </h3>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredOrders.length === 0 ? (
              <div className="p-8 text-center">
                <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500">No se encontraron comandas</p>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div key={order.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <span className="text-lg font-semibold text-gray-900">
                          #{order.orderNumber}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1 capitalize">{order.status.replace('_', ' ')}</span>
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {getSourceIcon(order.source)}
                          <span className="ml-1 capitalize">{order.source}</span>
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <p><strong>Cliente:</strong> {order.customerInfo.name || 'Sin nombre'}</p>
                          <p><strong>Teléfono:</strong> {order.customerInfo.phone || 'No disponible'}</p>
                        </div>
                        <div>
                          <p><strong>Tipo:</strong> {order.customerInfo.deliveryType}</p>
                          {order.customerInfo.tableNumber && (
                            <p><strong>Mesa:</strong> {order.customerInfo.tableNumber}</p>
                          )}
                        </div>
                        <div>
                          <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
                          <p><strong>Items:</strong> {order.items.length}</p>
                        </div>
                      </div>

                      <div className="mt-3">
                        <p className="text-sm text-gray-600">
                          <strong>Items:</strong> {order.items.map(item => `${item.name} (${item.quantity})`).join(', ')}
                        </p>
                        {order.notes && (
                          <p className="text-sm text-gray-600 mt-1">
                            <strong>Notas:</strong> {order.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2 ml-6">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className="px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="en_preparacion">En Preparación</option>
                        <option value="listo">Listo</option>
                        <option value="entregado">Entregado</option>
                        <option value="cancelado">Cancelado</option>
                      </select>
                      
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-3 py-1 text-sm bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors"
                      >
                        Ver Detalles
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal de detalles */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  Detalles de la Comanda #{selectedOrder.orderNumber}
                </h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Información del cliente */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Información del Cliente</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <p><strong>Nombre:</strong> {selectedOrder.customerInfo.name || 'No disponible'}</p>
                  <p><strong>Teléfono:</strong> {selectedOrder.customerInfo.phone || 'No disponible'}</p>
                  <p><strong>Email:</strong> {selectedOrder.customerInfo.email || 'No disponible'}</p>
                  <p><strong>Tipo de entrega:</strong> {selectedOrder.customerInfo.deliveryType}</p>
                  {selectedOrder.customerInfo.tableNumber && (
                    <p><strong>Mesa:</strong> {selectedOrder.customerInfo.tableNumber}</p>
                  )}
                  {selectedOrder.customerInfo.deliveryAddress && (
                    <p><strong>Dirección:</strong> {selectedOrder.customerInfo.deliveryAddress}</p>
                  )}
                </div>
              </div>

              {/* Items del pedido */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Items del Pedido</h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-medium text-gray-900">{item.name}</h5>
                        <span className="text-primary-600 font-semibold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Cantidad: {item.quantity} × ${item.price.toFixed(2)}
                      </p>
                      {item.modifiers.length > 0 && (
                        <div className="text-sm text-gray-600">
                          <p className="font-medium mb-1">Modificadores:</p>
                          <div className="flex flex-wrap gap-1">
                            {item.modifiers.map((modifier, index) => (
                              <span key={index} className="bg-gray-100 px-2 py-1 rounded text-xs">
                                {modifier.modifierName}: {modifier.value > 0 ? `+${modifier.value}` : modifier.value === -1 ? 'Sin' : 'Normal'}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {item.comments && (
                        <p className="text-sm text-gray-600 mt-2">
                          <strong>Comentarios:</strong> {item.comments}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Información adicional */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Información Adicional</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <p><strong>Total:</strong> ${selectedOrder.total.toFixed(2)}</p>
                  <p><strong>Fuente:</strong> {selectedOrder.source}</p>
                  <p><strong>Creado:</strong> {selectedOrder.createdAt.toLocaleString()}</p>
                  <p><strong>Actualizado:</strong> {selectedOrder.updatedAt.toLocaleString()}</p>
                  {selectedOrder.estimatedTime && (
                    <p><strong>Tiempo estimado:</strong> {selectedOrder.estimatedTime} minutos</p>
                  )}
                  {selectedOrder.notes && (
                    <p className="col-span-2"><strong>Notas:</strong> {selectedOrder.notes}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  onDeleteOrder(selectedOrder.id)
                  setSelectedOrder(null)
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
              >
                Eliminar Comanda
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
