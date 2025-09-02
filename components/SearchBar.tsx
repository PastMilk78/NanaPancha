'use client'

import { Search, Filter } from 'lucide-react'
import { SearchFilters } from '@/types'

interface SearchBarProps {
  filters: SearchFilters
  onFiltersChange: (filters: SearchFilters) => void
  categories: { id: string; name: string; icon: string }[]
}

export default function SearchBar({ filters, onFiltersChange, categories }: SearchBarProps) {
  const handleSearchChange = (searchTerm: string) => {
    onFiltersChange({ ...filters, searchTerm })
  }

  const handleCategoryChange = (selectedCategory: string) => {
    onFiltersChange({ ...filters, selectedCategory })
  }

  const clearFilters = () => {
    onFiltersChange({ searchTerm: '', selectedCategory: '' })
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Barra de búsqueda */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar platos..."
              value={filters.searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Filtro por categoría */}
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            value={filters.selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Todas las categorías</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.icon} {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Botón para limpiar filtros */}
        {(filters.searchTerm || filters.selectedCategory) && (
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Limpiar
          </button>
        )}
      </div>

      {/* Filtros activos */}
      {(filters.searchTerm || filters.selectedCategory) && (
        <div className="mt-3 flex flex-wrap gap-2">
          {filters.searchTerm && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary-100 text-primary-800">
              Buscar: &ldquo;{filters.searchTerm}&rdquo;
            </span>
          )}
          {filters.selectedCategory && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
              Categoría: {categories.find(c => c.id === filters.selectedCategory)?.name}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
