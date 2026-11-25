import { Prisma } from '@prisma/client'
import { Router } from 'express'
import { createSession, destroySession, optionalAuth, requireAuth, setSessionCookie } from '../auth/session.js'
import { hashPassword, verifyPassword } from '../auth/password.js'
import { prisma } from '../lib/prisma.js'
import { loginSchema, registerSchema } from '../schemas/auth.js'

export const authRouter = Router()

authRouter.get('/me', optionalAuth, (request, response) => {
  response.json({ data: request.authUser ?? null })
})

authRouter.post('/register', async (request, response) => {
  const parsed = registerSchema.safeParse(request.body)
  if (!parsed.success) {
    response.status(400).json({
      error: { message: parsed.error.issues[0]?.message ?? 'Проверьте данные регистрации.' },
    })
    return
  }

  const passwordHash = await hashPassword(parsed.data.password)
  try {
    const { user, sessionToken } = await prisma.$transaction(async (transaction) => {
      const createdUser = await transaction.user.create({
        data: {
          name: parsed.data.name,
          email: parsed.data.email,
          passwordHash,
        },
        select: { id: true, name: true, email: true },
      })
      const createdSessionToken = await createSession(createdUser.id, transaction)
      return { user: createdUser, sessionToken: createdSessionToken }
    })
    setSessionCookie(response, sessionToken)
    response.status(201).json({ data: user })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      response.status(409).json({ error: { message: 'Аккаунт с таким email уже существует.' } })
      return
    }
    throw error
  }
})

authRouter.post('/login', async (request, response) => {
  const parsed = loginSchema.safeParse(request.body)
  if (!parsed.success) {
    response.status(400).json({
      error: { message: parsed.error.issues[0]?.message ?? 'Проверьте email и пароль.' },
    })
    return
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email },
    select: { id: true, name: true, email: true, passwordHash: true },
  })
  const passwordMatches = await verifyPassword(parsed.data.password, user?.passwordHash ?? null)

  if (!user || !passwordMatches) {
    response.status(401).json({ error: { message: 'Неверный email или пароль.' } })
    return
  }

  const sessionToken = await createSession(user.id)
  setSessionCookie(response, sessionToken)
  response.json({ data: { id: user.id, name: user.name, email: user.email } })
})

authRouter.post('/logout', async (request, response) => {
  await destroySession(request, response)
  response.json({ data: null })
})

authRouter.get('/orders', requireAuth, async (request, response) => {
  const authenticatedUser = request.authUser
  if (!authenticatedUser) {
    response.status(401).json({ error: { message: 'Войдите в аккаунт, чтобы продолжить.' } })
    return
  }

  const orders = await prisma.order.findMany({
    where: { userId: authenticatedUser.id },
    orderBy: { createdAt: 'desc' },
    include: { items: { orderBy: { id: 'asc' } } },
  })

  response.json({
    data: orders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      createdAt: order.createdAt,
      totalCents: order.totalCents,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      address: order.address,
      paymentMethod: order.paymentMethod,
      items: order.items.map((item) => ({
        productId: item.productId,
        sku: item.productSku,
        title: item.productTitle,
        quantity: item.quantity,
        unitPriceCents: item.unitPriceCents,
        lineTotalCents: item.lineTotalCents,
      })),
    })),
  })
})
