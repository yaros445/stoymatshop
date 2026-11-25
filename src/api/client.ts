import { categories as localCategories } from '../data/categories.ts'
import { pluralizeProducts } from '../utils/pluralize.ts'
import type { Category, Product } from '../types.ts'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? '/api'

export interface ApiUser {
  id: string
  name: string
  email: string
}

export interface ApiOrderItem {
  productId: number
  sku: string
  title: string
  quantity: number
  unitPriceCents: number
  lineTotalCents: number
}

export interface ApiOrder {
  id: string
  orderNumber: string
  status: string
  createdAt: string
  totalCents: number
  customerName?: string
  customerPhone?: string
  address?: string
  paymentMethod?: string
  items: ApiOrderItem[]
}

export interface CreateOrderInput {
  customerName: string
  customerPhone: string
  address: string
  comment?: string
  items: Array<{ productId: number; quantity: number }>
}

interface ApiEnvelope<T> {
  data: T
}

interface ApiCategory {
  id: string
  title: string
  icon: string
  productsCount: number
}

interface ApiProduct extends Product {
  category: { id: string; title: string }
}

interface ProductPage {
  data: ApiProduct[]
  pagination: {
    page: number
    pageSize: number
    total: number
    pageCount: number
  }
}

export interface StoreCatalog {
  categories: Category[]
  products: Product[]
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
      ...init,
      credentials: 'include',
      headers: {
        ...(init.body ? { 'Content-Type': 'application/json' } : {}),
        ...init.headers,
      },
    })
  } catch (error) {
    if (error instanceof TypeError) {
      throw new ApiError('Не удалось подключиться к серверу. Проверьте, что backend запущен.', 0)
    }
    throw error
  }

  let payload: unknown
  try {
    payload = await response.json()
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new ApiError('Сервер API вернул некорректный ответ.', response.status)
    }
    throw error
  }

  if (!response.ok) {
    const message = isRecord(payload) &&
      isRecord(payload.error) &&
      typeof payload.error.message === 'string'
      ? payload.error.message
      : 'Не удалось выполнить запрос. Попробуйте ещё раз.'
    throw new ApiError(message, response.status)
  }

  return payload as T
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

export async function fetchStoreCatalog(): Promise<StoreCatalog> {
  const [categoryEnvelope, firstPage] = await Promise.all([
    request<ApiEnvelope<ApiCategory[]>>('/categories'),
    request<ProductPage>('/products?page=1&pageSize=100'),
  ])
  const products = [...firstPage.data]

  for (let page = 2; page <= firstPage.pagination.pageCount; page += 1) {
    const nextPage = await request<ProductPage>(`/products?page=${page}&pageSize=100`)
    products.push(...nextPage.data)
  }

  return {
    categories: categoryEnvelope.data.map((category) => ({
      id: category.id,
      title: category.title,
      icon: localCategories.find((item) => item.id === category.id)?.icon ?? 'mix',
      count: pluralizeProducts(category.productsCount),
    })),
    products: products.map(({ category, ...product }) => ({
      ...product,
      categoryId: category.id,
    })),
  }
}

export async function fetchCurrentUser(): Promise<ApiUser | null> {
  const response = await request<ApiEnvelope<ApiUser | null>>('/auth/me')
  return response.data
}

export async function registerAccount(input: {
  name: string
  email: string
  password: string
}): Promise<ApiUser> {
  const response = await request<ApiEnvelope<ApiUser>>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(input),
  })
  return response.data
}

export async function loginAccount(input: {
  email: string
  password: string
}): Promise<ApiUser> {
  const response = await request<ApiEnvelope<ApiUser>>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(input),
  })
  return response.data
}

export async function logoutAccount(): Promise<void> {
  await request<ApiEnvelope<null>>('/auth/logout', { method: 'POST' })
}

export async function fetchAccountOrders(): Promise<ApiOrder[]> {
  const response = await request<ApiEnvelope<ApiOrder[]>>('/auth/orders')
  return response.data
}

export async function submitOrder(input: CreateOrderInput): Promise<ApiOrder> {
  const response = await request<ApiEnvelope<ApiOrder>>('/orders', {
    method: 'POST',
    body: JSON.stringify(input),
  })
  return response.data
}
