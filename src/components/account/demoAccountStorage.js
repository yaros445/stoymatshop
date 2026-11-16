const demoDataKey = 'stroybaza.demo.data'
const emptyDemoData = { users: [], currentUserId: null, orders: [] }

export function readDemoData() {
  try {
    const storedData = localStorage.getItem(demoDataKey)
    if (!storedData) return emptyDemoData

    const parsedData = JSON.parse(storedData)
    if (!Array.isArray(parsedData.users) || !Array.isArray(parsedData.orders)) {
      throw new Error('Некорректный формат данных')
    }

    return {
      users: parsedData.users,
      currentUserId: parsedData.currentUserId ?? null,
      orders: parsedData.orders,
    }
  } catch (error) {
    console.error('Не удалось загрузить демо-данные магазина:', error)
    return emptyDemoData
  }
}

export function saveDemoData(data) {
  localStorage.setItem(demoDataKey, JSON.stringify(data))
}

export async function hashPassword(password, salt) {
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

export function createId() {
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
