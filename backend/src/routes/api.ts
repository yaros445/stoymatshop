import { randomBytes } from 'node:crypto'
import { Router } from 'express'
import { Prisma } from '@prisma/client'
import { prisma } from '../lib/prisma.js'
import { HttpError } from '../lib/http-error.js'
import { createOrderSchema } from '../schemas/order.js'
import { optionalAuth } from '../auth/session.js'

export const apiRouter = Router()

apiRouter.get('/health', async (_request, response) => {
  await prisma.$queryRaw`SELECT 1`
  response.json({ status: 'ok' })
})

apiRouter.get('/categories', async (_request, response) => {
  const categories = await prisma.category.findMany({
    orderBy: { title: 'asc' },
    include: { _count: { select: { products: { where: { active: true } } } } },
  })

  response.json({
    data: categories.map(({ id, title, icon, _count }) => ({
      id,
      title,
      icon,
      productsCount: _count.products,
    })),
  })
})

apiRouter.get('/products', async (request, response) => {
  const querySchema = Prisma.validator<Prisma.ProductWhereInput>()({
    active: true,
  })
  const page = parsePositiveInteger(request.query.page, 1, 1_000_000)
  const pageSize = parsePositiveInteger(request.query.pageSize, 20, 100)
  const maxPriceCents = request.query.maxPriceCents === undefined
    ? undefined
    : parsePositiveInteger(request.query.maxPriceCents, 0, 2_147_483_647)
  const categoryId = parseOptionalString(request.query.categoryId, 120)
  const brand = parseOptionalString(request.query.brand, 120)
  const search = parseOptionalString(request.query.search, 200)

  if (
    page === null || page < 1 ||
    pageSize === null || pageSize < 1 ||
    maxPriceCents === null ||
    categoryId === null || brand === null || search === null
  ) {
    throw new HttpError(400, 'Invalid product filter. Check the query parameter values.')
  }

  const where: Prisma.ProductWhereInput = {
    ...querySchema,
    ...(categoryId ? { categoryId } : {}),
    ...(brand ? { brand } : {}),
    ...(maxPriceCents !== undefined ? { priceCents: { lte: maxPriceCents } } : {}),
    ...(request.query.inStock === 'true' ? { stock: { gt: 0 } } : {}),
    ...(search ? {
      OR: [
        { title: { contains: search } },
        { sku: { contains: search } },
        { brand: { contains: search } },
      ],
    } : {}),
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { id: 'asc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { category: { select: { id: true, title: true } } },
    }),
    prisma.product.count({ where }),
  ])

  response.json({
    data: products.map(({ stock, category, ...product }) => ({
      ...product,
      category,
      inStock: stock > 0,
    })),
    pagination: { page, pageSize, total, pageCount: Math.ceil(total / pageSize) },
  })
})

apiRouter.post('/orders', optionalAuth, async (request, response) => {
  const parsed = createOrderSchema.safeParse(request.body)
  if (!parsed.success) {
    response.status(400).json({
      error: {
        message: 'Order details are invalid.',
        details: parsed.error.flatten().fieldErrors,
      },
    })
    return
  }

  const input = parsed.data
  const productsById = new Map<number, (typeof input.items)[number]>()
  for (const item of input.items) productsById.set(item.productId, item)

  const order = await prisma.$transaction(async (transaction) => {
    const products = await transaction.product.findMany({
      where: { id: { in: [...productsById.keys()] }, active: true },
    })

    if (products.length !== input.items.length) {
      throw new HttpError(400, 'One or more products are unavailable.')
    }

    const orderItems = products.map((product) => {
      const requested = productsById.get(product.id)
      if (!requested) throw new HttpError(400, 'One or more products are unavailable.')
      if (product.stock < requested.quantity) {
        throw new HttpError(409, `Not enough stock for product ${product.sku}.`)
      }

      return {
        product,
        quantity: requested.quantity,
        lineTotalCents: product.priceCents * requested.quantity,
      }
    })

    const totalCents = orderItems.reduce((total, item) => total + item.lineTotalCents, 0)
    if (!Number.isSafeInteger(totalCents) || totalCents > 2_147_483_647) {
      throw new HttpError(400, 'Order total is too large.')
    }

    for (const item of orderItems) {
      const updated = await transaction.product.updateMany({
        where: { id: item.product.id, active: true, stock: { gte: item.quantity } },
        data: { stock: { decrement: item.quantity } },
      })
      if (updated.count !== 1) {
        throw new HttpError(409, `Not enough stock for product ${item.product.sku}.`)
      }
    }

    const orderNumber = `SB-${Date.now()}-${randomBytes(3).toString('hex').toUpperCase()}`
    return transaction.order.create({
      data: {
        orderNumber,
        userId: request.authUser?.id ?? null,
        customerName: input.customerName,
        customerPhone: input.customerPhone,
        address: input.address,
        comment: input.comment || null,
        totalCents,
        items: {
          create: orderItems.map(({ product, quantity, lineTotalCents }) => ({
            productId: product.id,
            productSku: product.sku,
            productTitle: product.title,
            quantity,
            unitPriceCents: product.priceCents,
            lineTotalCents,
          })),
        },
      },
      include: { items: true },
    })
  })

  response.status(201).json({
    data: {
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      totalCents: order.totalCents,
      createdAt: order.createdAt,
      items: order.items.map((item) => ({
        productId: item.productId,
        sku: item.productSku,
        title: item.productTitle,
        quantity: item.quantity,
        unitPriceCents: item.unitPriceCents,
        lineTotalCents: item.lineTotalCents,
      })),
    },
  })
})

function parsePositiveInteger(value: unknown, fallback: number, max: number): number | null
function parsePositiveInteger(value: unknown, fallback: undefined, max: number): number | undefined | null
function parsePositiveInteger(value: unknown, fallback: number | undefined, max: number): number | undefined | null {
  if (value === undefined) return fallback
  if (typeof value !== 'string' || !/^\d+$/.test(value)) return null
  const parsed = Number(value)
  return Number.isSafeInteger(parsed) && parsed <= max ? parsed : null
}

function parseOptionalString(value: unknown, maxLength: number): string | undefined | null {
  if (value === undefined) return undefined
  if (typeof value !== 'string' || value.trim().length === 0 || value.length > maxLength) return null
  return value.trim()
}
