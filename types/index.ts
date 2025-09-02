export interface MenuItem {
  id: string
  name: string
  price: number
  extras: string[]
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
  extras: string[]
  quantity: number
  comments?: string
}

export interface SearchFilters {
  searchTerm: string
  selectedCategory: string
}
