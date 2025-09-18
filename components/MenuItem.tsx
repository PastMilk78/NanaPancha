'use client'

import { useState } from 'react'
import { Plus, Minus, ChevronDown } from 'lucide-react'
import { MenuItem as MenuItemType, ModifierSelection } from '@/types'

interface MenuItemProps {
  item: MenuItemType
  onAddToOrder: (item: MenuItemType, modifiers: ModifierSelection[]) => void
}

export default function MenuItem({ item, onAddToOrder }: MenuItemProps) {
  const [selectedModifiers, setSelectedModifiers] = useState<ModifierSelection[]>([])
  const [showModifiers, setShowModifiers] = useState(false)

  const getModifierValue = (modifierId: string): number => {
    const modifier = selectedModifiers.find(m => m.modifierId === modifierId)
    return modifier?.value || 0
  }

  const getSelectedOptions = (modifierId: string): string[] => {
    const modifier = selectedModifiers.find(m => m.modifierId === modifierId)
    return modifier?.options || []
  }

  const updateModifier = (modifierId: string, modifierName: string, value: number, options?: string[], pricePerUnit?: number, optionPrice?: number) => {
    const existingIndex = selectedModifiers.findIndex(m => m.modifierId === modifierId)
    
    if (existingIndex >= 0) {
      if (value === 0) {
        // Remover modificador si el valor es 0
        setSelectedModifiers(selectedModifiers.filter((_, index) => index !== existingIndex))
      } else {
        // Actualizar valor existente
        const updated = [...selectedModifiers]
        updated[existingIndex] = { 
          ...updated[existingIndex], 
          value, 
          options,
          pricePerUnit,
          optionPrice
        }
        setSelectedModifiers(updated)
      }
    } else if (value !== 0) {
      // Agregar nuevo modificador
      setSelectedModifiers([...selectedModifiers, { 
        modifierId, 
        modifierName, 
        value, 
        options,
        pricePerUnit,
        optionPrice
      }])
    }
  }

  const toggleOption = (modifierId: string, modifierName: string, optionName: string, optionPrice: number) => {
    const existingIndex = selectedModifiers.findIndex(m => m.modifierId === modifierId)
    const currentOptions = getSelectedOptions(modifierId)
    const isSelected = currentOptions.includes(optionName)
    
    let newOptions: string[]
    if (isSelected) {
      // Remover opción
      newOptions = currentOptions.filter(opt => opt !== optionName)
    } else {
      // Agregar opción
      newOptions = [...currentOptions, optionName]
    }
    
    // Calcular precio total de las opciones seleccionadas
    const totalOptionPrice = newOptions.reduce((total, opt) => {
      const option = item.modifiers.find(m => m.id === modifierId)?.options?.find(o => o.name === opt)
      return total + (option?.price || 0)
    }, 0)
    
    if (existingIndex >= 0) {
      if (newOptions.length === 0) {
        // Remover modificador si no hay opciones seleccionadas
        setSelectedModifiers(selectedModifiers.filter((_, index) => index !== existingIndex))
      } else {
        // Actualizar opciones existentes
        const updated = [...selectedModifiers]
        updated[existingIndex] = { 
          ...updated[existingIndex], 
          options: newOptions,
          optionPrice: totalOptionPrice
        }
        setSelectedModifiers(updated)
      }
    } else if (newOptions.length > 0) {
      // Agregar nuevo modificador con opciones
      setSelectedModifiers([...selectedModifiers, { 
        modifierId, 
        modifierName, 
        value: 1, 
        options: newOptions,
        optionPrice: totalOptionPrice
      }])
    }
  }

  const handleAddToOrder = () => {
    onAddToOrder(item, selectedModifiers)
    setSelectedModifiers([])
    setShowModifiers(false)
  }

  const renderModifierControls = (modifier: any) => {
    const currentValue = getModifierValue(modifier.id)
    const selectedOptions = getSelectedOptions(modifier.id)

    if (modifier.type === 'option' && modifier.options) {
      return (
        <div className="space-y-2">
          <p className="text-sm text-gray-600 mb-2">
            Seleccionar {modifier.allowMultiple ? 'opciones' : 'opción'}:
          </p>
          <div className="grid grid-cols-2 gap-2">
            {modifier.options.map((option: any) => {
              const isSelected = selectedOptions.includes(option.name)
              return (
                <button
                  key={option.name}
                  onClick={() => toggleOption(modifier.id, modifier.name, option.name, option.price || 0)}
                  className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                    isSelected
                      ? 'bg-primary-500 text-white border-primary-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-2">
                      {modifier.allowMultiple && (
                        <div className={`w-4 h-4 rounded border-2 ${
                          isSelected 
                            ? 'bg-white border-white' 
                            : 'border-gray-300'
                        }`}>
                          {isSelected && (
                            <div className="w-2 h-2 bg-primary-500 rounded-sm mx-auto mt-0.5" />
                          )}
                        </div>
                      )}
                      <span>{option.name}</span>
                    </div>
                    {option.price > 0 && (
                      <div className="text-xs opacity-75 mt-1">
                        +${option.price.toFixed(2)}
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
          {modifier.allowMultiple && selectedOptions.length > 0 && (
            <div className="text-xs text-primary-600 bg-primary-50 px-2 py-1 rounded">
              Seleccionadas: {selectedOptions.join(', ')}
            </div>
          )}
        </div>
      )
    }

    return (
      <div className="flex items-center space-x-3">
        <span className="text-sm text-gray-600 min-w-[60px]">{modifier.name}:</span>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => updateModifier(modifier.id, modifier.name, currentValue - 1, undefined, modifier.pricePerUnit)}
            disabled={currentValue <= -1}
            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-8 text-center text-sm font-medium">
            {currentValue === -1 ? 'Sin' : currentValue === 0 ? 'Normal' : `+${currentValue}`}
          </span>
          <button
            onClick={() => updateModifier(modifier.id, modifier.name, currentValue + 1, undefined, modifier.pricePerUnit)}
            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        {modifier.pricePerUnit && modifier.pricePerUnit > 0 && (
          <span className="text-xs text-gray-500 ml-2">
            +${modifier.pricePerUnit.toFixed(2)}/unidad
          </span>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-semibold text-gray-900">{item.name}</h4>
          <p className="text-primary-600 font-medium">${item.price.toFixed(2)}</p>
        </div>
        <button
          onClick={() => setShowModifiers(!showModifiers)}
          className="text-gray-500 hover:text-primary-600 transition-colors"
        >
          <ChevronDown className={`h-5 w-5 transform transition-transform ${showModifiers ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {showModifiers && (
        <div className="mb-4 space-y-4">
          <p className="text-sm text-gray-600 font-medium">Personalizar:</p>
          {item.modifiers.map((modifier) => (
            <div key={modifier.id} className="border-t border-gray-100 pt-3">
              {renderModifierControls(modifier)}
            </div>
          ))}
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
