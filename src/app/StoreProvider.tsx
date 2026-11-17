import { useMemo, useState } from 'react'
import type { PropsWithChildren } from 'react'
import { readDemoData } from '../components/account/demoAccountStorage.ts'
import { products } from '../data/products.ts'
import { useCatalogFilters } from '../features/catalog/useCatalogFilters.ts'
import { filterProducts } from '../utils/storefront.ts'
import { sumCartTotalCents } from '../utils/money.ts'
import { StoreContext } from './storeContext.ts'
import type { StoreContextValue } from './storeContext.ts'
import type { Cart, DemoData } from '../types.ts'

export function StoreProvider({ children }: PropsWithChildren) {
  const { filters, dispatch, resetFilters } = useCatalogFilters()
  const [favorites, setFavorites] = useState<number[]>([])
  const [cart, setCart] = useState<Cart>({})
  const [demoData, setDemoData] = useState<DemoData>(readDemoData)

  const currentUser = demoData.users.find((user) => user.id === demoData.currentUserId) ?? null
  const filteredProducts = useMemo(
    () => filterProducts(products, { ...filters, favorites }),
    [favorites, filters],
  )
  const cartCount = Object.values(cart).reduce((total, quantity) => total + quantity, 0)
  const cartTotalCents = sumCartTotalCents(products, cart)
  const cartProducts = useMemo(
    () => products.map((product) => ({ ...product, price: product.priceCents / 100 })),
    [],
  )

  const value = useMemo<StoreContextValue>(() => ({
    filters,
    dispatchFilters: dispatch,
    resetFilters,
    filteredProducts,
    favorites,
    toggleFavorite: (id) => {
      setFavorites((current) => current.includes(id)
        ? current.filter((favoriteId) => favoriteId !== id)
        : [...current, id])
    },
    cart,
    cartCount,
    cartTotalCents,
    cartProducts,
    addToCart: (id) => setCart((current) => ({ ...current, [id]: (current[id] ?? 0) + 1 })),
    changeQuantity: (id, amount) => setCart((current) => {
      const quantity = (current[id] ?? 0) + amount
      if (quantity <= 0) {
        const next = { ...current }
        delete next[id]
        return next
      }
      return { ...current, [id]: quantity }
    }),
    clearCart: () => setCart({}),
    demoData,
    setDemoData,
    currentUser,
  }), [
    cart,
    cartCount,
    cartProducts,
    cartTotalCents,
    currentUser,
    demoData,
    dispatch,
    favorites,
    filteredProducts,
    filters,
    resetFilters,
  ])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}
