import { createContext } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import type { CatalogFilterAction } from '../features/catalog/useCatalogFilters.ts'
import type { Cart, CartProduct, DemoData, DemoUser, Product } from '../types.ts'
import type { useCatalogFilters } from '../features/catalog/useCatalogFilters.ts'

export interface StoreContextValue {
  filters: ReturnType<typeof useCatalogFilters>['filters']
  dispatchFilters: Dispatch<CatalogFilterAction>
  resetFilters: () => void
  filteredProducts: Product[]
  favorites: number[]
  toggleFavorite: (id: number) => void
  cart: Cart
  cartCount: number
  cartTotalCents: number
  cartProducts: CartProduct[]
  addToCart: (id: number) => void
  changeQuantity: (id: number, amount: number) => void
  clearCart: () => void
  demoData: DemoData
  setDemoData: Dispatch<SetStateAction<DemoData>>
  currentUser: DemoUser | null
}

export const StoreContext = createContext<StoreContextValue | null>(null)
