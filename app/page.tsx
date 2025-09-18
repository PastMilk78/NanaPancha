'use client'

import { useState, useMemo, useRef } from 'react'
import { Plus, Trash2, ShoppingCart, Utensils, Search } from 'lucide-react'
import MenuItem from '@/components/MenuItem'
import OrderSummary from '@/components/OrderSummary'
import SearchBar from '@/components/SearchBar'
import Header from '@/components/Header'
import ProtectedRoute from '@/components/ProtectedRoute'
import ClientOnly from '@/components/ClientOnly'
import { MenuItemType, OrderItem, SearchFilters, ModifierSelection } from '@/types'

export default function Home() {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    searchTerm: '',
    selectedCategory: ''
  })
  const orderSummaryRef = useRef<HTMLDivElement>(null)

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
            { id: 'queso', name: 'Queso', type: 'additive', pricePerUnit: 1.50 },
            { id: 'pepperoni', name: 'Pepperoni', type: 'additive', pricePerUnit: 2.00 },
            { id: 'champinones', name: 'Champiñones', type: 'additive', pricePerUnit: 1.00 },
            { id: 'aceitunas', name: 'Aceitunas', type: 'additive', pricePerUnit: 0.75 },
            { 
              id: 'salsa', 
              name: 'Salsas', 
              type: 'option', 
              allowMultiple: true,
              options: [
                { name: 'Salsa de tomate', price: 0 },
                { name: 'Salsa blanca', price: 1.00 },
                { name: 'Salsa picante', price: 0.50 }
              ] 
            }
          ]
        },
        {
          id: 'pizza-pepperoni',
          name: 'Pizza Pepperoni',
          price: 14.99,
          modifiers: [
            { id: 'queso', name: 'Queso', type: 'additive', pricePerUnit: 1.50 },
            { id: 'pepperoni', name: 'Pepperoni', type: 'additive', pricePerUnit: 2.00 },
            { id: 'aceitunas', name: 'Aceitunas', type: 'additive', pricePerUnit: 0.75 },
            { 
              id: 'salsa', 
              name: 'Salsas', 
              type: 'option', 
              allowMultiple: true,
              options: [
                { name: 'Salsa de tomate', price: 0 },
                { name: 'Salsa blanca', price: 1.00 },
                { name: 'Salsa picante', price: 0.50 }
              ] 
            }
          ]
        },
        {
          id: 'pizza-hawaiana',
          name: 'Pizza Hawaiana',
          price: 15.99,
          modifiers: [
            { id: 'queso', name: 'Queso', type: 'additive', pricePerUnit: 1.50 },
            { id: 'jamon', name: 'Jamón', type: 'additive', pricePerUnit: 2.50 },
            { id: 'pina', name: 'Piña', type: 'additive', pricePerUnit: 0.50 },
            { 
              id: 'salsa', 
              name: 'Salsas', 
              type: 'option', 
              allowMultiple: true,
              options: [
                { name: 'Salsa de tomate', price: 0 },
                { name: 'Salsa blanca', price: 1.00 },
                { name: 'Salsa BBQ', price: 1.50 }
              ] 
            }
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
            { id: 'hielo', name: 'Hielo', type: 'additive', pricePerUnit: 0 },
            { id: 'limon', name: 'Limón', type: 'additive', pricePerUnit: 0.25 },
            { 
              id: 'azucar', 
              name: 'Azúcar', 
              type: 'option', 
              options: [
                { name: 'Con azúcar', price: 0 },
                { name: 'Sin azúcar', price: 0 },
                { name: 'Light', price: 0.50 }
              ] 
            }
          ]
        },
        {
          id: 'agua',
          name: 'Agua',
          price: 1.99,
          modifiers: [
            { id: 'hielo', name: 'Hielo', type: 'additive', pricePerUnit: 0 },
            { id: 'limon', name: 'Limón', type: 'additive', pricePerUnit: 0.25 },
            { 
              id: 'gas', 
              name: 'Gas', 
              type: 'option', 
              options: [
                { name: 'Con gas', price: 0.50 },
                { name: 'Sin gas', price: 0 }
              ] 
            }
          ]
        },
        {
          id: 'jugo-naranja',
          name: 'Jugo de Naranja',
          price: 3.99,
          modifiers: [
            { id: 'hielo', name: 'Hielo', type: 'additive', pricePerUnit: 0 },
            { 
              id: 'azucar', 
              name: 'Azúcar', 
              type: 'option', 
              options: [
                { name: 'Natural', price: 0 },
                { name: 'Con azúcar', price: 0.25 },
                { name: 'Sin azúcar', price: 0 }
              ] 
            }
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
            { id: 'pollo', name: 'Pollo', type: 'additive', pricePerUnit: 3.00 },
            { id: 'queso', name: 'Queso', type: 'additive', pricePerUnit: 1.50 },
            { id: 'crutones', name: 'Crutones', type: 'additive', pricePerUnit: 0.50 },
            { 
              id: 'aderezo', 
              name: 'Aderezos', 
              type: 'option', 
              allowMultiple: true,
              options: [
                { name: 'César', price: 0 },
                { name: 'Ranch', price: 0.50 },
                { name: 'Vinagreta', price: 0.25 },
                { name: 'Sin aderezo', price: 0 }
              ] 
            }
          ]
        },
        {
          id: 'sopa-tomate',
          name: 'Sopa de Tomate',
          price: 6.99,
          modifiers: [
            { id: 'crema', name: 'Crema', type: 'additive', pricePerUnit: 0.75 },
            { id: 'pan', name: 'Pan', type: 'additive', pricePerUnit: 0.50 },
            { 
              id: 'especias', 
              name: 'Especias', 
              type: 'option', 
              options: [
                { name: 'Suave', price: 0 },
                { name: 'Media', price: 0.25 },
                { name: 'Picante', price: 0.50 }
              ] 
            }
          ]
        },
        {
          id: 'bruschetta',
          name: 'Bruschetta',
          price: 5.99,
          modifiers: [
            { id: 'queso', name: 'Queso', type: 'additive', pricePerUnit: 1.00 },
            { id: 'ajo', name: 'Ajo', type: 'additive', pricePerUnit: 0 },
            { id: 'aceite', name: 'Aceite de oliva', type: 'additive', pricePerUnit: 0.50 }
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

  const scrollToOrderSummary = () => {
    orderSummaryRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    })
  }

  // Calcular total incluyendo modificadores
  const total = useMemo(() => {
    return orderItems.reduce((sum, item) => {
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
    }, 0)
  }, [orderItems])

  const categories = useMemo(() => menuItems.map(category => ({
    id: category.id,
    name: category.name,
    icon: category.icon
  })), [menuItems])

  return (
    <ClientOnly 
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando aplicación...</p>
          </div>
        </div>
      }
    >
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
        {/* Header con autenticación */}
        <Header />
        
        {/* Botón de ver pedido flotante */}
        <div className="fixed top-20 right-4 z-40">
          <button
            onClick={scrollToOrderSummary}
            className="flex items-center space-x-3 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 shadow-md"
          >
            <ShoppingCart className="h-6 w-6" />
            <div className="text-left">
              <div className="text-sm font-medium">Ver Pedido</div>
              <div className="text-lg font-bold">${total.toFixed(2)}</div>
            </div>
            {orderItems.length > 0 && (
              <div className="bg-white text-primary-500 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                {orderItems.length}
              </div>
            )}
          </button>
        </div>

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
          <div className="lg:col-span-1" ref={orderSummaryRef}>
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
      </ProtectedRoute>
    </ClientOnly>
  )
}
