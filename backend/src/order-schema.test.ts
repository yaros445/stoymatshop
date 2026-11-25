import assert from 'node:assert/strict'
import test from 'node:test'
import { createOrderSchema } from './schemas/order.js'

const validOrder = {
  customerName: 'Иван Иванов',
  customerPhone: '+375 (29) 123-45-67',
  address: 'Минск, ул. Складская, 14',
  items: [{ productId: 1, quantity: 2 }],
}

test('accepts a valid order and normalizes customer fields', () => {
  const result = createOrderSchema.parse({ ...validOrder, customerName: ' Иван Иванов ' })

  assert.equal(result.customerName, 'Иван Иванов')
  assert.deepEqual(result.items, [{ productId: 1, quantity: 2 }])
})

test('rejects duplicate products, zero quantity, and client-supplied prices', () => {
  assert.equal(createOrderSchema.safeParse({
    ...validOrder,
    items: [{ productId: 1, quantity: 1 }, { productId: 1, quantity: 2 }],
  }).success, false)
  assert.equal(createOrderSchema.safeParse({
    ...validOrder,
    items: [{ productId: 1, quantity: 0 }],
  }).success, false)
  assert.equal(createOrderSchema.safeParse({
    ...validOrder,
    items: [{ productId: 1, quantity: 1, priceCents: 1 }],
  }).success, false)
})

test('rejects invalid phone numbers and empty order contents', () => {
  assert.equal(createOrderSchema.safeParse({ ...validOrder, customerPhone: 'abc' }).success, false)
  assert.equal(createOrderSchema.safeParse({ ...validOrder, items: [] }).success, false)
})
