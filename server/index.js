import 'dotenv/config'
import mongoose from 'mongoose'
import { createApp } from './app.js'

const requiredEnvironment = ['MONGODB_URI', 'JWT_SECRET', 'ADMIN_EMAIL', 'ADMIN_PASSWORD']
const missingEnvironment = requiredEnvironment.filter(name => !process.env[name])

if (missingEnvironment.length) {
  throw new Error(`Missing required environment variables: ${missingEnvironment.join(', ')}`)
}

if (process.env.JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must be at least 32 characters long')
}
if (process.env.ADMIN_PASSWORD.length < 12) {
  throw new Error('ADMIN_PASSWORD must be at least 12 characters long')
}

const port = Number(process.env.PORT || 4000)

await mongoose.connect(process.env.MONGODB_URI)
const server = createApp().listen(port, () => {
  console.log(`CodePixel marketplace API listening on port ${port}`)
})

const shutdown = async signal => {
  console.log(`${signal} received; closing marketplace API`)
  server.close(async error => {
    if (error) {
      console.error('HTTP server shutdown failed', error)
      process.exitCode = 1
    }
    await mongoose.disconnect()
    process.exit()
  })
}

process.once('SIGINT', () => shutdown('SIGINT'))
process.once('SIGTERM', () => shutdown('SIGTERM'))
