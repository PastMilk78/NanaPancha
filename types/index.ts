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
  option?: string // Para modificadores de tipo 'option'
  pricePerUnit?: number // Precio por unidad extra
  optionPrice?: number // Precio de la opción seleccionada
}

export interface SearchFilters {
  searchTerm: string
  selectedCategory: string
}
