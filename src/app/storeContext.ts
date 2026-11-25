import { createContext } from 'react'
import type { Dispatch } from 'react'
import type { CatalogFilterAction } from '../features/catalog/useCatalogFilters.ts'
import type { ApiUser } from '../api/client.ts'
import type { Cart, CartProduct, Category, Product } from '../types.ts'
import type { useCatalogFilters } from '../features/catalog/useCatalogFilters.ts'

export type RequestStatus = 'loading' | 'ready' | 'error'

export interface StoreContextValue {
  filters: ReturnType<typeof useCatalogFilters>['filters']
  dispatchFilters: Dispatch<CatalogFilterAction>
  resetFilters: () => void
  products: Product[]
  categories: Category[]
  productBrands: string[]
  minProductPriceCents: number
  maxProductPriceCents: number
  catalogStatus: RequestStatus
  catalogError: string
  refreshCatalog: () => Promise<void>
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
  currentUser: ApiUser | null
  authLoading: boolean
  authLoadError: string
  signIn: (email: string, password: string) => Promise<void>
  signUp: (name: string, email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

export const StoreContext = createContext<StoreContextValue | null>(null)
