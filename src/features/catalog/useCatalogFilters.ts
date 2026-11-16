import { useReducer } from 'react'
import { ALL_BRANDS, ALL_CATEGORIES, TABS } from '../../constants/filters.ts'
import { MAX_PRICE_CENTS } from '../../data/products.ts'
import type { CatalogFilters } from '../../types.ts'

export type CatalogFilterAction =
  | { type: 'reset' }
  | { type: 'setSearch'; value: string }
  | { type: 'setCategory'; value: string }
  | { type: 'setTab'; value: string }
  | { type: 'setBrand'; value: string }
  | { type: 'setMaxPrice'; value: number }
  | { type: 'toggleInStock' }
  | { type: 'toggleFavorites' }

export const initialCatalogFilters: CatalogFilters = {
  search: '',
  category: ALL_CATEGORIES,
  tab: TABS.ALL,
  brand: ALL_BRANDS,
  maxPriceCents: MAX_PRICE_CENTS,
  inStockOnly: false,
  showFavorites: false,
}

export function catalogFiltersReducer(state: CatalogFilters, action: CatalogFilterAction): CatalogFilters {
  switch (action.type) {
    case 'reset':
      return initialCatalogFilters
    case 'setSearch':
      return { ...state, search: action.value, tab: TABS.ALL, showFavorites: false }
    case 'setCategory':
      return {
        ...state,
        category: action.value,
        tab: TABS.ALL,
        showFavorites: false,
      }
    case 'setTab':
      return { ...state, tab: action.value }
    case 'setBrand':
      return { ...state, brand: action.value }
    case 'setMaxPrice':
      return { ...state, maxPriceCents: action.value }
    case 'toggleInStock':
      return { ...state, inStockOnly: !state.inStockOnly }
    case 'toggleFavorites':
      return { ...state, category: ALL_CATEGORIES, showFavorites: !state.showFavorites }
    default:
      return state
  }
}

export function useCatalogFilters() {
  const [filters, dispatch] = useReducer(catalogFiltersReducer, initialCatalogFilters)

  return {
    filters,
    dispatch,
    resetFilters: () => dispatch({ type: 'reset' }),
  }
}
