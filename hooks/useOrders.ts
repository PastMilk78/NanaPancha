'use client'

import { useState, useEffect } from 'react'
import { Order, OrderItem } from '@/types'

// Simulación de almacenamiento local para las comandas
const ORDERS_STORAGE_KEY = 'mesero_nana_orders'

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([])

  // Cargar órdenes del localStorage al inicializar
  useEffect(() => {
    // Verificar si estamos en el cliente
    if (typeof window === 'undefined') return

    const savedOrders = localStorage.getItem(ORDERS_STORAGE_KEY)
    if (savedOrders) {
      try {
        const parsedOrders = JSON.parse(savedOrders).map((order: any) => ({
          ...order,
          createdAt: new Date(order.createdAt),
          updatedAt: new Date(order.updatedAt)
        }))
        setOrders(parsedOrders)
      } catch (error) {
        console.error('Error al cargar órdenes:', error)
      }
    }
  }, [])

  // Guardar órdenes en localStorage cuando cambien
  useEffect(() => {
    // Solo guardar en el cliente
    if (typeof window !== 'undefined') {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders))
    }
  }, [orders])

  const generateOrderNumber = () => {
    const today = new Date()
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '')
    const existingTodayOrders = orders.filter(order => 
      order.orderNumber.includes(dateStr)
    )
    const nextNumber = existingTodayOrders.length + 1
    return `ORD-${dateStr}-${String(nextNumber).padStart(3, '0')}`
  }

  const createOrder = (items: OrderItem[], customerInfo: any, source: 'interno' | 'whatsapp' | 'telefono' | 'web' = 'interno') => {
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      orderNumber: generateOrderNumber(),
      source,
      status: 'pendiente',
      customerInfo: {
        deliveryType: 'mesa',
        ...customerInfo
      },
      items,
      total: items.reduce((sum, item) => {
        let itemTotal = item.price * item.quantity
        
        // Agregar costo de modificadores
        item.modifiers.forEach(modifier => {
          if (modifier.value > 0 && modifier.pricePerUnit) {
            itemTotal += modifier.pricePerUnit * modifier.value * item.quantity
          }
          if (modifier.optionPrice) {
            itemTotal += modifier.optionPrice * item.quantity
          }
        })
        
        return sum + itemTotal
      }, 0),
      createdAt: new Date(),
      updatedAt: new Date(),
      estimatedTime: Math.floor(Math.random() * 30) + 15 // 15-45 minutos
    }

    setOrders(prevOrders => [newOrder, ...prevOrders])
    return newOrder
  }

  const updateOrder = (orderId: string, updates: Partial<Order>) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId
          ? { ...order, ...updates, updatedAt: new Date() }
          : order
      )
    )
  }

  const deleteOrder = (orderId: string) => {
    setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId))
  }

  const getOrdersByStatus = (status: string) => {
    return orders.filter(order => order.status === status)
  }

  const getOrdersBySource = (source: string) => {
    return orders.filter(order => order.source === source)
  }

  const getOrdersByDateRange = (startDate: Date, endDate: Date) => {
    return orders.filter(order => 
      order.createdAt >= startDate && order.createdAt <= endDate
    )
  }

  const getOrderStats = () => {
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pendiente').length,
      inPreparation: orders.filter(o => o.status === 'en_preparacion').length,
      ready: orders.filter(o => o.status === 'listo').length,
      delivered: orders.filter(o => o.status === 'entregado').length,
      cancelled: orders.filter(o => o.status === 'cancelado').length
    }
  }

  return {
    orders,
    createOrder,
    updateOrder,
    deleteOrder,
    getOrdersByStatus,
    getOrdersBySource,
    getOrdersByDateRange,
    getOrderStats
  }
}
