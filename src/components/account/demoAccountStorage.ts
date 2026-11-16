import type { DemoData, DemoOrder, DemoUser, OrderItem } from '../../types.ts'

const demoDataKey = 'stroybaza.demo.data'
const emptyDemoData: DemoData = { users: [], currentUserId: null, orders: [] }

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isDemoUser(value: unknown): value is DemoUser {
  return isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    typeof value.email === 'string' &&
    typeof value.passwordSalt === 'string' &&
    typeof value.passwordHash === 'string'
}

function isOrderItem(value: unknown): value is OrderItem {
  return isRecord(value) &&
    typeof value.id === 'number' &&
    typeof value.title === 'string' &&
    typeof value.quantity === 'number' &&
    typeof value.price === 'number'
}

function isDemoOrder(value: unknown): value is DemoOrder {
  return isRecord(value) &&
    typeof value.id === 'string' &&
    (typeof value.userId === 'string' || value.userId === null) &&
    typeof value.createdAt === 'string' &&
    typeof value.name === 'string' &&
    typeof value.phone === 'string' &&
    typeof value.address === 'string' &&
    typeof value.comment === 'string' &&
    typeof value.payment === 'string' &&
    Array.isArray(value.items) &&
    value.items.every(isOrderItem) &&
    typeof value.total === 'number'
}

function isDemoData(value: unknown): value is DemoData {
  return isRecord(value) &&
    Array.isArray(value.users) &&
    value.users.every(isDemoUser) &&
    Array.isArray(value.orders) &&
    value.orders.every(isDemoOrder) &&
    (typeof value.currentUserId === 'string' || value.currentUserId === null)
}

export function readDemoData(): DemoData {
  try {
    const storedData = localStorage.getItem(demoDataKey)
    if (!storedData) return emptyDemoData

    const parsedData = JSON.parse(storedData)
    if (!isDemoData(parsedData)) {
      throw new Error('Некорректный формат данных')
    }

    return {
      users: parsedData.users,
      currentUserId: parsedData.currentUserId,
      orders: parsedData.orders,
    }
  } catch (error) {
    console.error('Не удалось загрузить демо-данные магазина:', error)
    return emptyDemoData
  }
}

export function saveDemoData(data: DemoData): void {
  localStorage.setItem(demoDataKey, JSON.stringify(data))
}

export async function hashPassword(password: string, salt: string): Promise<string> {
  if (!globalThis.crypto?.subtle) {
    throw new Error('Для входа нужен современный браузер с поддержкой Web Crypto.')
  }

  const key = await globalThis.crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits'])
  const digest = await globalThis.crypto.subtle.deriveBits({
    name: 'PBKDF2',
    salt: new TextEncoder().encode(salt),
    iterations: 150000,
    hash: 'SHA-256',
  }, key, 256)
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

export function createId(): string {
  if (!globalThis.crypto?.getRandomValues) {
    throw new Error('Браузер не поддерживает безопасную генерацию идентификаторов.')
  }
  if (globalThis.crypto.randomUUID) return globalThis.crypto.randomUUID()

  const bytes = globalThis.crypto.getRandomValues(new Uint8Array(16))
  bytes[6] = (bytes[6] & 0x0f) | 0x40
  bytes[8] = (bytes[8] & 0x3f) | 0x80
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}
