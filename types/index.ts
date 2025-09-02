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
