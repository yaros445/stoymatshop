import { z } from 'zod'

const orderItemSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().min(1).max(999),
}).strict()

export const createOrderSchema = z.object({
  customerName: z.string().trim().min(2).max(120),
  customerPhone: z.string().trim().min(7).max(30).refine((phone) => {
    const digits = phone.replace(/\D/g, '')
    return digits.length >= 7 && digits.length <= 15
  }, 'Enter a valid phone number.'),
  address: z.string().trim().min(5).max(250),
  comment: z.string().trim().max(1000).optional(),
  items: z.array(orderItemSchema).min(1).max(50).refine(
    (items) => new Set(items.map((item) => item.productId)).size === items.length,
    'Each product may only appear once.',
  ),
}).strict()

export type CreateOrderInput = z.infer<typeof createOrderSchema>
