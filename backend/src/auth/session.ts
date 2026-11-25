import { createHash, randomBytes } from 'node:crypto'
import type { NextFunction, Request, Response } from 'express'
import type { Prisma } from '@prisma/client'
import { env } from '../config/env.js'
import { prisma } from '../lib/prisma.js'

export interface AuthenticatedUser {
  id: string
  name: string
  email: string
}

declare module 'express-serve-static-core' {
  interface Request {
    authUser?: AuthenticatedUser
  }
}

const cookieName = 'stoymatshop_session'
const sessionDurationMs = 30 * 24 * 60 * 60 * 1000
const cookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
}

function readSessionToken(request: Request): string | null {
  const cookies = request.headers.cookie?.split(';') ?? []
  const cookie = cookies.map((part) => part.trim()).find((part) => part.startsWith(`${cookieName}=`))
  const token = cookie?.slice(cookieName.length + 1)

  return token && /^[A-Za-z0-9_-]{40,50}$/.test(token) ? token : null
}

function hashSessionToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

export async function createSession(
  userId: string,
  client: Pick<Prisma.TransactionClient, 'userSession'> = prisma,
): Promise<string> {
  const token = randomBytes(32).toString('base64url')
  const expiresAt = new Date(Date.now() + sessionDurationMs)

  await client.userSession.create({
    data: {
      tokenHash: hashSessionToken(token),
      userId,
      expiresAt,
    },
  })

  return token
}

export function setSessionCookie(response: Response, token: string): void {
  response.cookie(cookieName, token, { ...cookieOptions, maxAge: sessionDurationMs })
}

export async function destroySession(request: Request, response: Response): Promise<void> {
  const token = readSessionToken(request)
  if (token) {
    await prisma.userSession.deleteMany({
      where: { tokenHash: hashSessionToken(token) },
    })
  }

  response.clearCookie(cookieName, cookieOptions)
}

async function loadAuthenticatedUser(request: Request): Promise<AuthenticatedUser | null> {
  const token = readSessionToken(request)
  if (!token) return null

  const session = await prisma.userSession.findUnique({
    where: { tokenHash: hashSessionToken(token) },
    include: { user: { select: { id: true, name: true, email: true } } },
  })

  if (!session) return null
  if (session.expiresAt <= new Date()) {
    await prisma.userSession.delete({ where: { id: session.id } })
    return null
  }

  return session.user
}

export async function optionalAuth(request: Request, _response: Response, next: NextFunction): Promise<void> {
  const user = await loadAuthenticatedUser(request)
  if (user) request.authUser = user
  next()
}

export async function requireAuth(request: Request, response: Response, next: NextFunction): Promise<void> {
  const user = await loadAuthenticatedUser(request)
  if (!user) {
    response.status(401).json({ error: { message: 'Войдите в аккаунт, чтобы продолжить.' } })
    return
  }

  request.authUser = user
  next()
}
