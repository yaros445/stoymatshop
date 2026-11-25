import assert from 'node:assert/strict'
import test from 'node:test'
import { hashPassword, verifyPassword } from './auth/password.js'
import { loginSchema, registerSchema } from './schemas/auth.js'

test('stores a scrypt hash and verifies only the matching password', async () => {
  const hash = await hashPassword('correct horse battery staple')

  assert.notEqual(hash, 'correct horse battery staple')
  assert.equal(await verifyPassword('correct horse battery staple', hash), true)
  assert.equal(await verifyPassword('wrong password', hash), false)
  assert.equal(await verifyPassword('any password', null), false)
})

test('normalizes email and enforces registration password length', () => {
  const result = registerSchema.parse({
    name: ' Иван ',
    email: '  USER@Example.com ',
    password: 'password123',
  })

  assert.equal(result.name, 'Иван')
  assert.equal(result.email, 'user@example.com')
  assert.equal(registerSchema.safeParse({
    name: 'Иван',
    email: 'user@example.com',
    password: 'short',
  }).success, false)
})

test('rejects invalid login email and unknown credential fields', () => {
  assert.equal(loginSchema.safeParse({ email: 'not-an-email', password: 'password123' }).success, false)
  assert.equal(loginSchema.safeParse({
    email: 'user@example.com',
    password: 'password123',
    isAdmin: true,
  }).success, false)
})
