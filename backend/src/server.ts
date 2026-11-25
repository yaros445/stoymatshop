import { app } from './app.js'
import { env } from './config/env.js'
import { prisma } from './lib/prisma.js'

const server = app.listen(env.PORT, () => {
  console.info(`Backend listening on http://localhost:${env.PORT}`)
})

async function shutdown(signal: string) {
  console.info(`${signal} received. Shutting down backend.`)
  server.close(async (error) => {
    if (error) {
      console.error('Failed to close HTTP server cleanly:', error)
      process.exitCode = 1
    }
    await prisma.$disconnect()
  })
}

process.on('SIGINT', () => { void shutdown('SIGINT') })
process.on('SIGTERM', () => { void shutdown('SIGTERM') })
