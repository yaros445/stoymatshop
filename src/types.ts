export type IconName =
  | 'search'
  | 'phone'
  | 'heart'
  | 'user'
  | 'cart'
  | 'menu'
  | 'chevron'
  | 'arrow'
  | 'plus'
  | 'close'
  | 'star'
  | 'truck'
  | 'shield'
  | 'boxes'
  | 'headset'
  | 'mix'
  | 'brick'
  | 'wood'
  | 'roof'
  | 'insulation'
  | 'tile'
  | 'water'
  | 'bolt'
  | 'tool'
  | 'fastener'
  | 'location'
  | 'clock'
  | 'mail'
  | 'calculator'
  | 'check'

export interface Category {
  id: string
  title: string
  icon: IconName
  count: string
}

export interface Product {
  id: number
  sku: string
  title: string
  categoryId: string
  brand: string
  priceCents: number
  oldPriceCents: number
  rating: number
  reviews: number
  image: string
  badge: string
  inStock: boolean
}

export type CartProduct = Product & { price: number }
export type Cart = Record<number, number>

export interface DemoUser {
  id: string
  name: string
  email: string
  passwordSalt: string
  passwordHash: string
}

export interface OrderItem {
  id: number
  title: string
  quantity: number
  price: number
}

export interface DemoOrder {
  id: string
  userId: string | null
  createdAt: string
  name: string
  phone: string
  address: string
  comment: string
  payment: string
  items: OrderItem[]
  total: number
}

export interface DemoData {
  users: DemoUser[]
  currentUserId: string | null
  orders: DemoOrder[]
}

export type AccountMode = 'login' | 'register' | 'profile'

export interface CatalogFilters {
  search: string
  category: string
  tab: string
  brand: string
  maxPriceCents: number
  inStockOnly: boolean
  showFavorites: boolean
}
