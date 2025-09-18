export interface MenuItem {
  id: string
  name: string
  price: number
  modifiers: Modifier[]
}

export interface Modifier {
  id: string
  name: string
  type: 'additive' | 'subtractive' | 'option'
  options?: ModifierOption[]
  pricePerUnit?: number // Precio por unidad extra
  allowMultiple?: boolean // Permite selección múltiple para opciones
}

export interface ModifierOption {
  name: string
  price?: number // Precio adicional por esta opción
}

export interface MenuItemType {
  id: string
  name: string
  icon: string
  items: MenuItem[]
}

export interface OrderItem {
  id: string
  name: string
  price: number
  modifiers: ModifierSelection[]
  quantity: number
  comments?: string
}

export interface ModifierSelection {
  modifierId: string
  modifierName: string
  value: number // -1 para quitar, 0 para normal, 1+ para extra
  options?: string[] // Para modificadores de tipo 'option' con selección múltiple
  pricePerUnit?: number // Precio por unidad extra
  optionPrice?: number // Precio total de las opciones seleccionadas
}

export interface SearchFilters {
  searchTerm: string
  selectedCategory: string
}

// Tipos para el sistema de comandas unificado
export interface Order {
  id: string
  orderNumber: string
  source: 'whatsapp' | 'telefono' | 'interno' | 'web'
  status: 'pendiente' | 'en_preparacion' | 'listo' | 'entregado' | 'cancelado'
  customerInfo: CustomerInfo
  items: OrderItem[]
  total: number
  createdAt: Date
  updatedAt: Date
  estimatedTime?: number // Tiempo estimado en minutos
  notes?: string
  assignedTo?: string // ID del mesero/cocinero asignado
}

export interface CustomerInfo {
  name?: string
  phone?: string
  address?: string
  email?: string
  deliveryType: 'domicilio' | 'recoger' | 'mesa'
  tableNumber?: string
  deliveryAddress?: string
}

export interface OrderFilters {
  status?: string
  source?: string
  dateFrom?: Date
  dateTo?: Date
  searchTerm?: string
}

export interface OrderStats {
  total: number
  pending: number
  inPreparation: number
  ready: number
  delivered: number
  cancelled: number
}