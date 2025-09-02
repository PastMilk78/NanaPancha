'use client'

import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { MenuItem as MenuItemType } from '@/types'

interface MenuItemProps {
  item: MenuItemType
  onAddToOrder: (item: MenuItemType, extras: string[]) => void
}

export default function MenuItem({ item, onAddToOrder }: MenuItemProps) {
  const [selectedExtras, setSelectedExtras] = useState<string[]>([])
  const [showExtras, setShowExtras] = useState(false)

  const toggleExtra = (extra: string) => {
    if (selectedExtras.includes(extra)) {
      setSelectedExtras(selectedExtras.filter(e => e !== extra))
    } else {
      setSelectedExtras([...selectedExtras, extra])
    }
  }

  const handleAddToOrder = () => {
    onAddToOrder(item, selectedExtras)
    setSelectedExtras([])
    setShowExtras(false)
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-semibold text-gray-900">{item.name}</h4>
          <p className="text-primary-600 font-medium">${item.price.toFixed(2)}</p>
        </div>
        <button
          onClick={() => setShowExtras(!showExtras)}
          className="text-gray-500 hover:text-primary-600 transition-colors"
        >
          {showExtras ? <Minus className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
        </button>
      </div>

      {showExtras && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Opciones extra:</p>
          <div className="space-y-2">
            {item.extras.map((extra) => (
              <label key={extra} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedExtras.includes(extra)}
                  onChange={() => toggleExtra(extra)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">{extra}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={handleAddToOrder}
        className="w-full btn-primary flex items-center justify-center space-x-2"
      >
        <Plus className="h-4 w-4" />
        <span>Agregar al Pedido</span>
      </button>
    </div>
  )
}
