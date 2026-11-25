import type { ErrorRequestHandler, RequestHandler } from 'express'
import { HttpError } from '../lib/http-error.js'

export const notFoundHandler: RequestHandler = (_request, response) => {
  response.status(404).json({ error: { message: 'Route not found.' } })
}

export const errorHandler: ErrorRequestHandler = (error: unknown, _request, response, next) => {
  if (response.headersSent) {
    next(error)
    return
  }

  if (error instanceof HttpError) {
    response.status(error.statusCode).json({ error: { message: error.message } })
    return
  }

  if (error instanceof SyntaxError && 'body' in error) {
    response.status(400).json({ error: { message: 'Request body must contain valid JSON.' } })
    return
  }

  console.error('Unhandled API error:', error)
  response.status(500).json({ error: { message: 'An unexpected server error occurred.' } })
}
