'use client'

import { Trash2, Plus, Minus } from 'lucide-react'
import { OrderItem } from '@/types'

interface OrderSummaryProps {
  items: OrderItem[]
  onRemoveItem: (itemId: string) => void
  onUpdateQuantity: (itemId: string, quantity: number) => void
  total: number
}

export default function OrderSummary({ 
  items, 
  onRemoveItem, 
  onUpdateQuantity, 
  total 
}: OrderSummaryProps) {
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
        {items.map((item) => (
          <div key={item.id} className="border-b border-gray-200 pb-3">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{item.name}</h4>
                {item.extras.length > 0 && (
                  <div className="text-sm text-gray-600 mt-1">
                    {item.extras.map((extra, index) => (
                      <span key={index} className="inline-block bg-gray-100 rounded-full px-2 py-1 text-xs mr-1 mb-1">
                        {extra}
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
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 pt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold text-gray-900">Total:</span>
          <span className="text-2xl font-bold text-primary-600">${total.toFixed(2)}</span>
        </div>
        
        <div className="space-y-3">
          <button className="w-full btn-primary py-3 text-lg">
            Finalizar Pedido
          </button>
          <button className="w-full btn-secondary py-3 text-lg">
            Limpiar Pedido
          </button>
        </div>
      </div>
    </div>
  )
}
