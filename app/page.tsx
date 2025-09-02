'use client'

import { useState } from 'react'
import { Plus, Trash2, ShoppingCart, Utensils } from 'lucide-react'
import MenuItem from '@/components/MenuItem'
import OrderSummary from '@/components/OrderSummary'
import { MenuItemType, OrderItem } from '@/types'

export default function Home() {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [showAddItem, setShowAddItem] = useState(false)

  const menuItems: MenuItemType[] = [
    {
      id: 'pizzas',
      name: 'Pizzas',
      icon: '🍕',
      items: [
        { id: 'pizza-margherita', name: 'Pizza Margherita', price: 12.99, extras: ['Extra queso', 'Extra pepperoni', 'Extra champiñones'] },
        { id: 'pizza-pepperoni', name: 'Pizza Pepperoni', price: 14.99, extras: ['Extra queso', 'Extra pepperoni', 'Extra aceitunas'] },
        { id: 'pizza-hawaiana', name: 'Pizza Hawaiana', price: 15.99, extras: ['Extra queso', 'Extra jamón', 'Extra piña'] },
      ]
    },
    {
      id: 'bebidas',
      name: 'Bebidas',
      icon: '🥤',
      items: [
        { id: 'coca-cola', name: 'Coca Cola', price: 2.99, extras: ['Sin hielo', 'Extra hielo', 'Sin azúcar'] },
        { id: 'agua', name: 'Agua', price: 1.99, extras: ['Con limón', 'Con gas', 'Sin gas'] },
        { id: 'jugo-naranja', name: 'Jugo de Naranja', price: 3.99, extras: ['Sin azúcar', 'Con hielo', 'Natural'] },
      ]
    },
    {
      id: 'ensaladas',
      name: 'Ensaladas/Entradas',
      icon: '🥗',
      items: [
        { id: 'ensalada-cesar', name: 'Ensalada César', price: 8.99, extras: ['Extra pollo', 'Extra queso', 'Sin crutones'] },
        { id: 'sopa-tomate', name: 'Sopa de Tomate', price: 6.99, extras: ['Extra crema', 'Sin crema', 'Con pan'] },
        { id: 'bruschetta', name: 'Bruschetta', price: 5.99, extras: ['Extra queso', 'Sin ajo', 'Con aceite de oliva'] },
      ]
    }
  ]

  const addToOrder = (item: any, extras: string[] = []) => {
    const newItem: OrderItem = {
      id: `${item.id}-${Date.now()}`,
      name: item.name,
      price: item.price,
      extras: extras,
      quantity: 1
    }
    setOrderItems([...orderItems, newItem])
  }

  const removeFromOrder = (itemId: string) => {
    setOrderItems(orderItems.filter(item => item.id !== itemId))
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromOrder(itemId)
      return
    }
    setOrderItems(orderItems.map(item => 
      item.id === itemId ? { ...item, quantity } : item
    ))
  }

  const total = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Utensils className="h-8 w-8 text-primary-600" />
              <h1 className="text-2xl font-bold text-gray-900">Mesero Nana</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <ShoppingCart className="h-6 w-6 text-gray-600" />
                <span className="text-lg font-semibold text-gray-900">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Menú */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Menú</h2>
              <button
                onClick={() => setShowAddItem(!showAddItem)}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Agregar Nueva Entrada</span>
              </button>
            </div>

            {/* Categorías del menú */}
            <div className="space-y-6">
              {menuItems.map((category) => (
                <div key={category.id} className="card">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="text-2xl">{category.icon}</span>
                    <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {category.items.map((item) => (
                      <MenuItem
                        key={item.id}
                        item={item}
                        onAddToOrder={addToOrder}
                      />
                    ))}
                  </div>
                </div>
              ))}

              {/* Formulario para agregar nueva entrada */}
              {showAddItem && (
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Agregar Nueva Entrada</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre de la entrada
                      </label>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="Ej: Hamburguesas"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Icono
                      </label>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="🍔"
                      />
                    </div>
                    <div className="flex space-x-3">
                      <button className="btn-primary">Guardar</button>
                      <button 
                        onClick={() => setShowAddItem(false)}
                        className="btn-secondary"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Resumen del pedido */}
          <div className="lg:col-span-1">
            <OrderSummary
              items={orderItems}
              onRemoveItem={removeFromOrder}
              onUpdateQuantity={updateQuantity}
              total={total}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
