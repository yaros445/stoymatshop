import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'

const scrypt = promisify(scryptCallback)
const keyLength = 64
const dummyHash = `scrypt$not-a-real-user$${Buffer.alloc(keyLength).toString('base64url')}`

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('base64url')
  const key = await scrypt(password, salt, keyLength) as Buffer
  return `scrypt$${salt}$${key.toString('base64url')}`
}

export async function verifyPassword(password: string, storedHash: string | null): Promise<boolean> {
  const [algorithm, salt, encodedKey, ...extra] = (storedHash ?? dummyHash).split('$')
  if (algorithm !== 'scrypt' || !salt || !encodedKey || extra.length > 0) return false

  const storedKey = Buffer.from(encodedKey, 'base64url')
  if (storedKey.length !== keyLength) return false

  const actualKey = await scrypt(password, salt, keyLength) as Buffer
  return timingSafeEqual(storedKey, actualKey) && storedHash !== null
}
