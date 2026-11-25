import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { PropsWithChildren } from 'react'
import { fetchCurrentUser, fetchStoreCatalog, loginAccount, logoutAccount, registerAccount } from '../api/client.ts'
import { MAX_PRICE_CENTS, MIN_PRICE_CENTS } from '../data/products.ts'
import { useCatalogFilters } from '../features/catalog/useCatalogFilters.ts'
import { filterProducts } from '../utils/storefront.ts'
import { sumCartTotalCents } from '../utils/money.ts'
import { StoreContext } from './storeContext.ts'
import type { StoreContextValue } from './storeContext.ts'
import type { Cart, Category, Product } from '../types.ts'
import type { RequestStatus } from './storeContext.ts'
import type { ApiUser } from '../api/client.ts'

export function StoreProvider({ children }: PropsWithChildren) {
  const { filters, dispatch } = useCatalogFilters()
  const [favorites, setFavorites] = useState<number[]>([])
  const [cart, setCart] = useState<Cart>({})
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [catalogStatus, setCatalogStatus] = useState<RequestStatus>('loading')
  const [catalogError, setCatalogError] = useState('')
  const [currentUser, setCurrentUser] = useState<ApiUser | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [authLoadError, setAuthLoadError] = useState('')
  const filtersInitialized = useRef(false)

  const refreshCatalog = useCallback(async () => {
    try {
      const catalog = await fetchStoreCatalog()
      setProducts(catalog.products)
      setCategories(catalog.categories)
      setCatalogError('')
      setCatalogStatus('ready')
    } catch (error) {
      setCatalogError(error instanceof Error ? error.message : 'Не удалось загрузить каталог.')
      setCatalogStatus('error')
    }
  }, [])

  useEffect(() => {
    let active = true
    fetchStoreCatalog()
      .then((catalog) => {
        if (!active) return
        setProducts(catalog.products)
        setCategories(catalog.categories)
        setCatalogError('')
        setCatalogStatus('ready')
      })
      .catch((error: unknown) => {
        if (!active) return
        setCatalogError(error instanceof Error ? error.message : 'Не удалось загрузить каталог.')
        setCatalogStatus('error')
      })

    return () => { active = false }
  }, [])

  useEffect(() => {
    let active = true
    fetchCurrentUser()
      .then((user) => {
        if (active) setCurrentUser(user)
      })
      .catch((error: unknown) => {
        if (active) setAuthLoadError(error instanceof Error ? error.message : 'Не удалось проверить сеанс.')
      })
      .finally(() => {
        if (active) setAuthLoading(false)
      })

    return () => { active = false }
  }, [])

  const filteredProducts = useMemo(
    () => filterProducts(products, { ...filters, favorites }, categories),
    [categories, favorites, filters, products],
  )
  const cartCount = Object.values(cart).reduce((total, quantity) => total + quantity, 0)
  const cartTotalCents = sumCartTotalCents(products, cart)
  const cartProducts = useMemo(
    () => products.filter((product) => cart[product.id]).map((product) => ({
      ...product,
      price: product.priceCents / 100,
    })),
    [cart, products],
  )
  const productBrands = useMemo(
    () => [...new Set(products.map((product) => product.brand))].sort((a, b) => a.localeCompare(b)),
    [products],
  )
  const minProductPriceCents = products.length
    ? Math.min(...products.map((product) => product.priceCents))
    : MIN_PRICE_CENTS
  const maxProductPriceCents = products.length
    ? Math.max(...products.map((product) => product.priceCents))
    : MAX_PRICE_CENTS

  useEffect(() => {
    if (catalogStatus === 'ready' && !filtersInitialized.current) {
      dispatch({ type: 'setMaxPrice', value: maxProductPriceCents })
      filtersInitialized.current = true
    }
  }, [catalogStatus, dispatch, maxProductPriceCents])

  const signIn = useCallback(async (email: string, password: string) => {
    setAuthLoadError('')
    const user = await loginAccount({ email, password })
    setCurrentUser(user)
  }, [])

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    setAuthLoadError('')
    const user = await registerAccount({ name, email, password })
    setCurrentUser(user)
  }, [])

  const signOut = useCallback(async () => {
    await logoutAccount()
    setCurrentUser(null)
  }, [])

  const resetFilters = useCallback(
    () => dispatch({ type: 'reset', maxPriceCents: maxProductPriceCents }),
    [dispatch, maxProductPriceCents],
  )

  const value = useMemo<StoreContextValue>(() => ({
    filters,
    dispatchFilters: dispatch,
    resetFilters,
    products,
    categories,
    productBrands,
    minProductPriceCents,
    maxProductPriceCents,
    catalogStatus,
    catalogError,
    refreshCatalog,
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
    currentUser,
    authLoading,
    authLoadError,
    signIn,
    signUp,
    signOut,
  }), [
    authLoadError,
    authLoading,
    cart,
    cartCount,
    cartProducts,
    cartTotalCents,
    catalogError,
    catalogStatus,
    categories,
    currentUser,
    dispatch,
    favorites,
    filteredProducts,
    filters,
    maxProductPriceCents,
    minProductPriceCents,
    productBrands,
    products,
    refreshCatalog,
    resetFilters,
    signIn,
    signOut,
    signUp,
  ])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}
