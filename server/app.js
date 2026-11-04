import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import { rateLimit } from 'express-rate-limit'
import templateRoutes from './routes/templates.js'
import categoryRoutes from './routes/categories.js'
import enquiryRoutes from './routes/enquiries.js'
import adminRoutes from './routes/admin.js'
import { isMongoReady } from './utils/database.js'

export function createApp() {
  const app = express()
  const origin = process.env.CLIENT_ORIGIN || 'http://localhost:5173'

  app.disable('x-powered-by')
  app.set('trust proxy', process.env.TRUST_PROXY === 'true' ? 1 : false)
  app.use(helmet())
  app.use(cors({ origin, credentials: true }))
  app.use(express.json({ limit: '100kb' }))
  app.use(cookieParser())
  app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: 'draft-8', legacyHeaders: false }))

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', database: isMongoReady() ? 'connected' : 'disconnected' })
  })
  app.use('/api/templates', templateRoutes)
  app.use('/api/template-categories', categoryRoutes)
  app.use('/api/template-enquiries', enquiryRoutes)
  app.use('/api/admin', adminRoutes)

  app.use((_req, res) => res.status(404).json({ error: 'Not found' }))
  app.use((error, _req, res, _next) => {
    if (error?.name === 'ValidationError') {
      return res.status(400).json({ error: 'Validation failed', details: Object.values(error.errors).map(item => item.message) })
    }
    if (error?.code === 11000) {
      return res.status(409).json({ error: 'A record with that value already exists' })
    }
    if (error?.type === 'entity.parse.failed') {
      return res.status(400).json({ error: 'Invalid JSON body' })
    }
    if (!error.status || error.status >= 500) console.error('Marketplace API error', error)
    return res.status(error.status || 500).json({
      error: error.status ? error.message : 'Internal server error',
      ...(error.details ? { details: error.details } : {})
    })
  })
  return app
}
