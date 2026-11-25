import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Имя должно содержать не менее 2 символов.').max(120),
  email: z.string().trim().toLowerCase().pipe(z.email('Укажите корректный email.').max(191)),
  password: z.string().min(8, 'Пароль должен содержать не менее 8 символов.').max(128),
}).strict()

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email('Укажите корректный email.').max(191)),
  password: z.string().min(1, 'Введите пароль.').max(128),
}).strict()

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
