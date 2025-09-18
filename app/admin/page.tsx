'use client'

import { useState, useEffect } from 'react'
import AdminDashboard from '@/components/AdminDashboard'
import ProtectedRoute from '@/components/ProtectedRoute'
import OrderSimulator from '@/components/OrderSimulator'
import { Order } from '@/types'
import { useOrders } from '@/hooks/useOrders'

// Datos de ejemplo para demostración
const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-001',
    source: 'whatsapp',
    status: 'pendiente',
    customerInfo: {
      name: 'María González',
      phone: '+52 55 1234 5678',
      deliveryType: 'domicilio',
      deliveryAddress: 'Calle Reforma 123, Col. Centro'
    },
    items: [
      {
        id: 'item-1',
        name: 'Pizza Margherita',
        price: 12.99,
        quantity: 1,
        modifiers: [],
        comments: 'Sin cebolla'
      },
      {
        id: 'item-2',
        name: 'Coca Cola',
        price: 2.99,
        quantity: 2,
        modifiers: []
      }
    ],
    total: 18.97,
    createdAt: new Date('2024-01-15T10:30:00'),
    updatedAt: new Date('2024-01-15T10:30:00'),
    estimatedTime: 25,
    notes: 'Cliente prefiere entrega después de las 7 PM'
  },
  {
    id: '2',
    orderNumber: 'ORD-002',
    source: 'telefono',
    status: 'en_preparacion',
    customerInfo: {
      name: 'Carlos Rodríguez',
      phone: '+52 55 9876 5432',
      deliveryType: 'mesa',
      tableNumber: '5'
    },
    items: [
      {
        id: 'item-3',
        name: 'Pizza Pepperoni',
        price: 14.99,
        quantity: 1,
        modifiers: [
          {
            modifierId: 'queso',
            modifierName: 'Queso',
            value: 1,
            pricePerUnit: 1.50
          }
        ]
      },
      {
        id: 'item-4',
        name: 'Ensalada César',
        price: 8.99,
        quantity: 1,
        modifiers: [
          {
            modifierId: 'pollo',
            modifierName: 'Pollo',
            value: 1,
            pricePerUnit: 3.00
          }
        ]
      }
    ],
    total: 28.48,
    createdAt: new Date('2024-01-15T11:15:00'),
    updatedAt: new Date('2024-01-15T11:20:00'),
    estimatedTime: 20
  },
  {
    id: '3',
    orderNumber: 'ORD-003',
    source: 'interno',
    status: 'listo',
    customerInfo: {
      name: 'Mesa 3',
      deliveryType: 'mesa',
      tableNumber: '3'
    },
    items: [
      {
        id: 'item-5',
        name: 'Pizza Hawaiana',
        price: 15.99,
        quantity: 1,
        modifiers: []
      },
      {
        id: 'item-6',
        name: 'Jugo de Naranja',
        price: 3.99,
        quantity: 1,
        modifiers: []
      }
    ],
    total: 19.98,
    createdAt: new Date('2024-01-15T11:45:00'),
    updatedAt: new Date('2024-01-15T12:00:00'),
    estimatedTime: 15
  },
  {
    id: '4',
    orderNumber: 'ORD-004',
    source: 'web',
    status: 'entregado',
    customerInfo: {
      name: 'Ana Martínez',
      phone: '+52 55 5555 1234',
      email: 'ana.martinez@email.com',
      deliveryType: 'recoger'
    },
    items: [
      {
        id: 'item-7',
        name: 'Sopa de Tomate',
        price: 6.99,
        quantity: 1,
        modifiers: [
          {
            modifierId: 'crema',
            modifierName: 'Crema',
            value: 1,
            pricePerUnit: 0.75
          }
        ]
      },
      {
        id: 'item-8',
        name: 'Bruschetta',
        price: 5.99,
        quantity: 1,
        modifiers: []
      }
    ],
    total: 13.73,
    createdAt: new Date('2024-01-15T09:30:00'),
    updatedAt: new Date('2024-01-15T10:15:00'),
    estimatedTime: 10
  },
  {
    id: '5',
    orderNumber: 'ORD-005',
    source: 'whatsapp',
    status: 'cancelado',
    customerInfo: {
      name: 'Luis Pérez',
      phone: '+52 55 7777 8888',
      deliveryType: 'domicilio',
      deliveryAddress: 'Av. Insurgentes 456, Col. Roma'
    },
    items: [
      {
        id: 'item-9',
        name: 'Pizza Margherita',
        price: 12.99,
        quantity: 2,
        modifiers: []
      }
    ],
    total: 25.98,
    createdAt: new Date('2024-01-15T08:45:00'),
    updatedAt: new Date('2024-01-15T09:00:00'),
    notes: 'Cliente canceló por cambio de planes'
  }
]

export default function AdminPage() {
  const [loading, setLoading] = useState(false)
  const { orders, updateOrder, deleteOrder } = useOrders()

  // Simular carga de datos
  useEffect(() => {
    setLoading(true)
    // Simular delay de API
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [])

  const handleUpdateOrder = (orderId: string, updates: Partial<Order>) => {
    updateOrder(orderId, updates)
  }

  const handleDeleteOrder = (orderId: string) => {
    deleteOrder(orderId)
  }

  // Inicializar con datos de ejemplo si no hay órdenes
  useEffect(() => {
    if (orders.length === 0) {
      // Agregar algunas órdenes de ejemplo
      mockOrders.forEach(order => {
        updateOrder(order.id, order)
      })
    }
  }, [orders.length, updateOrder])

  if (loading) {
    return (
      <ProtectedRoute requiredRoles={['admin', 'cocinero']}>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando dashboard de administración...</p>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute requiredRoles={['admin', 'cocinero']}>
      <AdminDashboard 
        orders={orders}
        onUpdateOrder={handleUpdateOrder}
        onDeleteOrder={handleDeleteOrder}
      />
      <OrderSimulator />
    </ProtectedRoute>
  )
}
