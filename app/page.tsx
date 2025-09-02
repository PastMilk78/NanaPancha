'use client'

import { useState, useMemo } from 'react'
import { Plus, Trash2, ShoppingCart, Utensils, Search } from 'lucide-react'
import MenuItem from '@/components/MenuItem'
import OrderSummary from '@/components/OrderSummary'
import SearchBar from '@/components/SearchBar'
import { MenuItemType, OrderItem, SearchFilters, ModifierSelection } from '@/types'

export default function Home() {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    searchTerm: '',
    selectedCategory: ''
  })

  // Memoizar menuItems para evitar recreación en cada render
  const menuItems: MenuItemType[] = useMemo(() => [
    {
      id: 'pizzas',
      name: 'Pizzas',
      icon: '🍕',
      items: [
        {
          id: 'pizza-margherita',
          name: 'Pizza Margherita',
          price: 12.99,
          modifiers: [
            { id: 'queso', name: 'Queso', type: 'additive' },
            { id: 'pepperoni', name: 'Pepperoni', type: 'additive' },
            { id: 'champinones', name: 'Champiñones', type: 'additive' },
            { id: 'aceitunas', name: 'Aceitunas', type: 'additive' },
            { id: 'salsa', name: 'Salsa', type: 'option', options: ['Salsa de tomate', 'Salsa blanca', 'Salsa picante'] }
          ]
        },
        {
          id: 'pizza-pepperoni',
          name: 'Pizza Pepperoni',
          price: 14.99,
          modifiers: [
            { id: 'queso', name: 'Queso', type: 'additive' },
            { id: 'pepperoni', name: 'Pepperoni', type: 'additive' },
            { id: 'aceitunas', name: 'Aceitunas', type: 'additive' },
            { id: 'salsa', name: 'Salsa', type: 'option', options: ['Salsa de tomate', 'Salsa blanca', 'Salsa picante'] }
          ]
        },
        {
          id: 'pizza-hawaiana',
          name: 'Pizza Hawaiana',
          price: 15.99,
          modifiers: [
            { id: 'queso', name: 'Queso', type: 'additive' },
            { id: 'jamon', name: 'Jamón', type: 'additive' },
            { id: 'pina', name: 'Piña', type: 'additive' },
            { id: 'salsa', name: 'Salsa', type: 'option', options: ['Salsa de tomate', 'Salsa blanca', 'Salsa BBQ'] }
          ]
        }
      ]
    },
    {
      id: 'bebidas',
      name: 'Bebidas',
      icon: '🥤',
      items: [
        {
          id: 'coca-cola',
          name: 'Coca Cola',
          price: 2.99,
          modifiers: [
            { id: 'hielo', name: 'Hielo', type: 'additive' },
            { id: 'limon', name: 'Limón', type: 'additive' },
            { id: 'azucar', name: 'Azúcar', type: 'option', options: ['Con azúcar', 'Sin azúcar', 'Light'] }
          ]
        },
        {
          id: 'agua',
          name: 'Agua',
          price: 1.99,
          modifiers: [
            { id: 'hielo', name: 'Hielo', type: 'additive' },
            { id: 'limon', name: 'Limón', type: 'additive' },
            { id: 'gas', name: 'Gas', type: 'option', options: ['Con gas', 'Sin gas'] }
          ]
        },
        {
          id: 'jugo-naranja',
          name: 'Jugo de Naranja',
          price: 3.99,
          modifiers: [
            { id: 'hielo', name: 'Hielo', type: 'additive' },
            { id: 'azucar', name: 'Azúcar', type: 'option', options: ['Natural', 'Con azúcar', 'Sin azúcar'] }
          ]
        }
      ]
    },
    {
      id: 'ensaladas',
      name: 'Ensaladas/Entradas',
      icon: '🥗',
      items: [
        {
          id: 'ensalada-cesar',
          name: 'Ensalada César',
          price: 8.99,
          modifiers: [
            { id: 'pollo', name: 'Pollo', type: 'additive' },
            { id: 'queso', name: 'Queso', type: 'additive' },
            { id: 'crutones', name: 'Crutones', type: 'additive' },
            { id: 'aderezo', name: 'Aderezo', type: 'option', options: ['César', 'Ranch', 'Vinagreta', 'Sin aderezo'] }
          ]
        },
        {
          id: 'sopa-tomate',
          name: 'Sopa de Tomate',
          price: 6.99,
          modifiers: [
            { id: 'crema', name: 'Crema', type: 'additive' },
            { id: 'pan', name: 'Pan', type: 'additive' },
            { id: 'especias', name: 'Especias', type: 'option', options: ['Suave', 'Media', 'Picante'] }
          ]
        },
        {
          id: 'bruschetta',
          name: 'Bruschetta',
          price: 5.99,
          modifiers: [
            { id: 'queso', name: 'Queso', type: 'additive' },
            { id: 'ajo', name: 'Ajo', type: 'additive' },
            { id: 'aceite', name: 'Aceite de oliva', type: 'additive' }
          ]
        }
      ]
    }
  ], [])

  // Filtrar elementos del menú basado en la búsqueda
  const filteredMenuItems = useMemo(() => {
    return menuItems.map(category => {
      const filteredItems = category.items.filter(item => {
        const matchesSearch = searchFilters.searchTerm === '' || 
          item.name.toLowerCase().includes(searchFilters.searchTerm.toLowerCase())
        const matchesCategory = searchFilters.selectedCategory === '' || 
          category.id === searchFilters.selectedCategory
        
        return matchesSearch && matchesCategory
      })

      return {
        ...category,
        items: filteredItems
      }
    }).filter(category => category.items.length > 0)
  }, [menuItems, searchFilters])

  const addToOrder = (item: any, modifiers: ModifierSelection[] = []) => {
    const newItem: OrderItem = {
      id: `${item.id}-${Date.now()}`,
      name: item.name,
      price: item.price,
      modifiers: modifiers,
      quantity: 1,
      comments: ''
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

  const updateComments = (itemId: string, comments: string) => {
    setOrderItems(orderItems.map(item => 
      item.id === itemId ? { ...item, comments } : item
    ))
  }

  const total = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  const categories = useMemo(() => menuItems.map(category => ({
    id: category.id,
    name: category.name,
    icon: category.icon
  })), [menuItems])

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
              <p className="text-gray-600">Selecciona los platos y personaliza según las preferencias del cliente</p>
            </div>

            {/* Barra de búsqueda */}
            <SearchBar
              filters={searchFilters}
              onFiltersChange={setSearchFilters}
              categories={categories}
            />

            {/* Categorías del menú filtradas */}
            <div className="space-y-6">
              {filteredMenuItems.length > 0 ? (
                filteredMenuItems.map((category) => (
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
                ))
              ) : (
                <div className="card text-center py-8">
                  <div className="text-gray-400 mb-2">
                    <Search className="mx-auto h-12 w-12" />
                  </div>
                  <p className="text-gray-500">No se encontraron resultados</p>
                  <p className="text-sm text-gray-400">Intenta ajustar los filtros de búsqueda</p>
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
              onUpdateComments={updateComments}
              total={total}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
