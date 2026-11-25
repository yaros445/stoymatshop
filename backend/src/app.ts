import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { allowedOrigins } from './config/env.js'
import { errorHandler, notFoundHandler } from './middleware/error-handler.js'
import { HttpError } from './lib/http-error.js'
import { authRouter } from './routes/auth.js'
import { apiRouter } from './routes/api.js'

export const app = express()

app.disable('x-powered-by')
app.use(helmet())
app.use(cors({
  credentials: true,
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
      return
    }
    callback(new HttpError(403, 'Origin is not allowed by CORS.'))
  },
}))
app.use(express.json({ limit: '32kb' }))
const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
})
app.use('/api/auth/login', authRateLimit)
app.use('/api/auth/register', authRateLimit)
app.use('/api/orders', rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
}))
app.use('/api/auth', authRouter)
app.use('/api', apiRouter)
app.use(notFoundHandler)
app.use(errorHandler)
