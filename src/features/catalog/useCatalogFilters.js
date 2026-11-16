import { useReducer } from 'react'
import { ALL_BRANDS, ALL_CATEGORIES, TABS } from '../../constants/filters.js'
import { MAX_PRICE_CENTS } from '../../data/products.js'

export const initialCatalogFilters = {
  search: '',
  category: ALL_CATEGORIES,
  tab: TABS.ALL,
  brand: ALL_BRANDS,
  maxPriceCents: MAX_PRICE_CENTS,
  inStockOnly: false,
  showFavorites: false,
}

export function catalogFiltersReducer(state, action) {
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
