'use client'

import { useState } from 'react'
import { MessageSquare, Phone, Plus, X } from 'lucide-react'
import { useOrders } from '@/hooks/useOrders'
import { OrderItem } from '@/types'

export default function OrderSimulator() {
  const [showSimulator, setShowSimulator] = useState(false)
  const [simulatedOrders, setSimulatedOrders] = useState<Array<{
    id: string
    source: 'whatsapp' | 'telefono'
    customerInfo: any
    items: OrderItem[]
    total: number
  }>>([])
  const { createOrder } = useOrders()

  const generateWhatsAppOrder = () => {
    const customers = [
      { name: 'Ana García', phone: '+52 55 1234 5678', deliveryType: 'domicilio', deliveryAddress: 'Calle Reforma 123' },
      { name: 'Carlos López', phone: '+52 55 9876 5432', deliveryType: 'recoger' },
      { name: 'María Rodríguez', phone: '+52 55 5555 1234', deliveryType: 'domicilio', deliveryAddress: 'Av. Insurgentes 456' }
    ]

    const items = [
      { name: 'Pizza Margherita', price: 12.99, quantity: 1 },
      { name: 'Pizza Pepperoni', price: 14.99, quantity: 1 },
      { name: 'Pizza Hawaiana', price: 15.99, quantity: 1 },
      { name: 'Coca Cola', price: 2.99, quantity: 2 },
      { name: 'Ensalada César', price: 8.99, quantity: 1 }
    ]

    const customer = customers[Math.floor(Math.random() * customers.length)]
    const selectedItems = items.slice(0, Math.floor(Math.random() * 3) + 1)
    const total = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

    const newOrder = {
      id: `whatsapp-${Date.now()}`,
      source: 'whatsapp' as const,
      customerInfo: customer,
      items: selectedItems.map(item => ({
        id: `item-${Date.now()}-${Math.random()}`,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        modifiers: [],
        comments: ''
      })),
      total
    }

    setSimulatedOrders(prev => [newOrder, ...prev])
  }

  const generatePhoneOrder = () => {
    const customers = [
      { name: 'Roberto Silva', phone: '+52 55 7777 8888', deliveryType: 'domicilio', deliveryAddress: 'Calle Juárez 789' },
      { name: 'Laura Martínez', phone: '+52 55 3333 4444', deliveryType: 'recoger' },
      { name: 'Pedro González', phone: '+52 55 6666 7777', deliveryType: 'domicilio', deliveryAddress: 'Av. Chapultepec 321' }
    ]

    const items = [
      { name: 'Pizza Margherita', price: 12.99, quantity: 1 },
      { name: 'Pizza Pepperoni', price: 14.99, quantity: 1 },
      { name: 'Sopa de Tomate', price: 6.99, quantity: 1 },
      { name: 'Bruschetta', price: 5.99, quantity: 1 },
      { name: 'Jugo de Naranja', price: 3.99, quantity: 1 }
    ]

    const customer = customers[Math.floor(Math.random() * customers.length)]
    const selectedItems = items.slice(0, Math.floor(Math.random() * 3) + 1)
    const total = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

    const newOrder = {
      id: `telefono-${Date.now()}`,
      source: 'telefono' as const,
      customerInfo: customer,
      items: selectedItems.map(item => ({
        id: `item-${Date.now()}-${Math.random()}`,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        modifiers: [],
        comments: ''
      })),
      total
    }

    setSimulatedOrders(prev => [newOrder, ...prev])
  }

  const acceptOrder = (order: any) => {
    createOrder(order.items, order.customerInfo, order.source)
    setSimulatedOrders(prev => prev.filter(o => o.id !== order.id))
  }

  const rejectOrder = (orderId: string) => {
    setSimulatedOrders(prev => prev.filter(o => o.id !== orderId))
  }

  return (
    <>
      {/* Botón flotante para abrir el simulador */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setShowSimulator(!showSimulator)}
          className="bg-primary-500 hover:bg-primary-600 text-white p-4 rounded-full shadow-lg transition-colors"
        >
          <Plus className="h-6 w-6" />
        </button>
      </div>

      {/* Panel del simulador */}
      {showSimulator && (
        <div className="fixed bottom-24 right-6 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Simulador de Comandas</h3>
              <button
                onClick={() => setShowSimulator(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Simula comandas de WhatsApp y teléfono
            </p>
          </div>

          <div className="p-4 space-y-3">
            <button
              onClick={generateWhatsAppOrder}
              className="w-full flex items-center space-x-3 p-3 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg transition-colors"
            >
              <MessageSquare className="h-5 w-5 text-green-600" />
              <span className="text-green-800 font-medium">Simular WhatsApp</span>
            </button>

            <button
              onClick={generatePhoneOrder}
              className="w-full flex items-center space-x-3 p-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
            >
              <Phone className="h-5 w-5 text-blue-600" />
              <span className="text-blue-800 font-medium">Simular Teléfono</span>
            </button>
          </div>

          {/* Lista de comandas simuladas */}
          {simulatedOrders.length > 0 && (
            <div className="border-t border-gray-200 p-4">
              <h4 className="font-medium text-gray-900 mb-3">
                Comandas Pendientes ({simulatedOrders.length})
              </h4>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {simulatedOrders.map((order) => (
                  <div key={order.id} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      {order.source === 'whatsapp' ? (
                        <MessageSquare className="h-4 w-4 text-green-600" />
                      ) : (
                        <Phone className="h-4 w-4 text-blue-600" />
                      )}
                      <span className="text-sm font-medium text-gray-900">
                        {order.customerInfo.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        ${order.total.toFixed(2)}
                      </span>
                    </div>
                    
                    <div className="text-xs text-gray-600 mb-2">
                      {order.items.map(item => `${item.name} (${item.quantity})`).join(', ')}
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => acceptOrder(order)}
                        className="flex-1 px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                      >
                        Aceptar
                      </button>
                      <button
                        onClick={() => rejectOrder(order.id)}
                        className="flex-1 px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                      >
                        Rechazar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}
