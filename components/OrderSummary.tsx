'use client'

import { useState } from 'react'
import { Trash2, Plus, Minus, MessageSquare, User, Phone, MapPin } from 'lucide-react'
import { OrderItem } from '@/types'
import { useOrders } from '@/hooks/useOrders'

interface OrderSummaryProps {
  items: OrderItem[]
  onRemoveItem: (itemId: string) => void
  onUpdateQuantity: (itemId: string, quantity: number) => void
  onUpdateComments: (itemId: string, comments: string) => void
  total: number
}

export default function OrderSummary({ 
  items, 
  onRemoveItem, 
  onUpdateQuantity, 
  onUpdateComments,
  total 
}: OrderSummaryProps) {
  const [editingComments, setEditingComments] = useState<string | null>(null)
  const [tempComments, setTempComments] = useState('')
  const [showCustomerForm, setShowCustomerForm] = useState(false)
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    tableNumber: '',
    deliveryType: 'mesa' as 'mesa' | 'domicilio' | 'recoger'
  })
  const { createOrder } = useOrders()

  const handleEditComments = (itemId: string, currentComments: string) => {
    setEditingComments(itemId)
    setTempComments(currentComments || '')
  }

  const handleSaveComments = (itemId: string) => {
    onUpdateComments(itemId, tempComments)
    setEditingComments(null)
    setTempComments('')
  }

  const handleCancelEdit = () => {
    setEditingComments(null)
    setTempComments('')
  }

  const renderModifierText = (modifier: any) => {
    if (modifier.options && modifier.options.length > 0) {
      return modifier.options.join(', ')
    }
    
    if (modifier.value === -1) {
      return `Sin ${modifier.modifierName}`
    } else if (modifier.value === 0) {
      return modifier.modifierName
    } else {
      return `Extra ${modifier.modifierName} (${modifier.value})`
    }
  }

  const calculateItemTotal = (item: OrderItem) => {
    let itemTotal = item.price
    
    // Agregar costo de modificadores
    item.modifiers.forEach(modifier => {
      if (modifier.value > 0 && modifier.pricePerUnit) {
        itemTotal += modifier.pricePerUnit * modifier.value
      }
      if (modifier.optionPrice) {
        itemTotal += modifier.optionPrice
      }
    })
    
    return itemTotal * item.quantity
  }

  if (items.length === 0) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen del Pedido</h3>
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m6 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
            </svg>
          </div>
          <p className="text-gray-500">No hay elementos en el pedido</p>
          <p className="text-sm text-gray-400">Agrega elementos del menú para comenzar</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen del Pedido</h3>
      
      <div className="space-y-3 mb-6">
        {items.map((item) => {
          const itemTotal = calculateItemTotal(item)
          const basePrice = item.price * item.quantity
          const modifiersTotal = itemTotal - basePrice
          
          return (
            <div key={item.id} className="border-b border-gray-200 pb-3">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{item.name}</h4>
                  <div className="text-sm text-gray-600 mt-1">
                    <div>Base: ${item.price.toFixed(2)} × {item.quantity}</div>
                    {modifiersTotal > 0 && (
                      <div className="text-primary-600">Modificadores: +${modifiersTotal.toFixed(2)}</div>
                    )}
                  </div>
                  {item.modifiers.length > 0 && (
                    <div className="text-sm text-gray-600 mt-1">
                      {item.modifiers.map((modifier, index) => (
                        <span key={index} className="inline-block bg-gray-100 rounded-full px-2 py-1 text-xs mr-1 mb-1">
                          {renderModifierText(modifier)}
                          {modifier.value > 0 && modifier.pricePerUnit && (
                            <span className="ml-1 text-primary-600">
                              (+${(modifier.pricePerUnit * modifier.value).toFixed(2)})
                            </span>
                          )}
                          {modifier.optionPrice && modifier.optionPrice > 0 && (
                            <span className="ml-1 text-primary-600">
                              (+${modifier.optionPrice.toFixed(2)})
                            </span>
                          )}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="text-red-500 hover:text-red-700 ml-2"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              
              {/* Comentarios del item */}
              <div className="mb-3">
                {editingComments === item.id ? (
                  <div className="space-y-2">
                    <textarea
                      value={tempComments}
                      onChange={(e) => setTempComments(e.target.value)}
                      placeholder="Agregar comentarios especiales..."
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                      rows={2}
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleSaveComments(item.id)}
                        className="px-3 py-1 text-xs bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-3 py-1 text-xs bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="h-4 w-4 text-gray-400" />
                      {item.comments ? (
                        <span className="text-sm text-gray-700 bg-yellow-50 px-2 py-1 rounded border">
                          {item.comments}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-500">Sin comentarios</span>
                      )}
                    </div>
                    <button
                      onClick={() => handleEditComments(item.id, item.comments || '')}
                      className="text-sm text-primary-600 hover:text-primary-700 hover:underline"
                    >
                      {item.comments ? 'Editar' : 'Agregar'}
                    </button>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <span className="font-medium text-gray-900">
                  ${itemTotal.toFixed(2)}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="border-t border-gray-200 pt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold text-gray-900">Total:</span>
          <span className="text-2xl font-bold text-primary-600">${total.toFixed(2)}</span>
        </div>
        
        <div className="space-y-3">
          <button 
            onClick={() => setShowCustomerForm(true)}
            className="w-full btn-primary py-3 text-lg"
          >
            Finalizar Pedido
          </button>
          <button 
            onClick={() => {
              // Limpiar todos los items del pedido
              items.forEach(item => onRemoveItem(item.id))
            }}
            className="w-full btn-secondary py-3 text-lg"
          >
            Limpiar Pedido
          </button>
        </div>
      </div>

      {/* Modal de información del cliente */}
      {showCustomerForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Información del Cliente
              </h3>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Pedido
                </label>
                <select
                  value={customerInfo.deliveryType}
                  onChange={(e) => setCustomerInfo({...customerInfo, deliveryType: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="mesa">Mesa</option>
                  <option value="domicilio">Domicilio</option>
                  <option value="recoger">Recoger</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Cliente
                </label>
                <input
                  type="text"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                  placeholder="Nombre del cliente"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                  placeholder="Número de teléfono"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {customerInfo.deliveryType === 'mesa' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de Mesa
                  </label>
                  <input
                    type="text"
                    value={customerInfo.tableNumber}
                    onChange={(e) => setCustomerInfo({...customerInfo, tableNumber: e.target.value})}
                    placeholder="Número de mesa"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              )}

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Resumen del Pedido</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span>{item.name} × {item.quantity}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="flex justify-between font-semibold">
                      <span>Total:</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowCustomerForm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  const newOrder = createOrder(items, customerInfo, 'interno')
                  setShowCustomerForm(false)
                  // Limpiar el pedido después de crear la orden
                  items.forEach(item => onRemoveItem(item.id))
                  // Resetear información del cliente
                  setCustomerInfo({
                    name: '',
                    phone: '',
                    tableNumber: '',
                    deliveryType: 'mesa'
                  })
                  alert(`Comanda #${newOrder.orderNumber} creada exitosamente`)
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 transition-colors"
              >
                Crear Comanda
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
