import { after, before, test } from 'node:test'
import assert from 'node:assert/strict'
import mongoose from 'mongoose'
import request from 'supertest'
import { createApp } from '../app.js'
import { initialCategories, initialTemplates } from '../data/initialTemplates.js'

process.env.JWT_SECRET = 'test-secret-with-more-than-thirty-two-characters'
process.env.ADMIN_EMAIL = 'admin@example.com'
process.env.ADMIN_PASSWORD = 'test-password'
const app = createApp()

before(async () => {
  await mongoose.disconnect()
})

after(async () => {
  await mongoose.disconnect()
})

test('health endpoint reports database readiness without exposing configuration', async () => {
  const response = await request(app).get('/api/health').expect(200)
  assert.equal(response.body.status, 'ok')
  assert.equal(response.body.database, 'disconnected')
  assert.equal(Object.hasOwn(response.body, 'environment'), false)
})

test('admin endpoints reject requests without an admin session', async () => {
  await request(app).get('/api/admin/overview').expect(401)
})

test('administrator login issues a scoped HttpOnly session cookie', async () => {
  const agent = request.agent(app)
  await agent.post('/api/admin/login').send({ email: 'admin@example.com', password: 'wrong-password' }).expect(401)
  const login = await agent.post('/api/admin/login').send({ email: 'admin@example.com', password: 'test-password' }).expect(200)
  const cookie = login.headers['set-cookie'].find(value => value.startsWith('marketplaceAdmin='))
  assert.match(cookie, /HttpOnly/i)
  assert.match(cookie, /SameSite=Strict/i)
  const session = await agent.get('/api/admin/session').expect(200)
  assert.equal(session.body.admin.role, 'admin')
})

test('template enquiries reject incomplete data without writing to MongoDB', async () => {
  const response = await request(app).post('/api/template-enquiries').send({}).expect(400)
  assert.equal(response.body.error, 'Request validation failed')
  assert.ok(Array.isArray(response.body.details))
})

test('template enquiry validates HTTPS-only reference URLs', async () => {
  const response = await request(app).post('/api/template-enquiries').send({
    name: 'Test Client',
    email: 'client@example.com',
    businessDescription: 'I need a small business website.',
    referenceUrls: ['http://example.com']
  }).expect(400)
  assert.match(response.body.details.join(' '), /HTTPS/)
})

test('initial catalogue contains unique records and no unconfigured live demos', () => {
  assert.equal(initialCategories.length, 24)
  assert.equal(initialTemplates.length, 24)
  assert.equal(new Set(initialCategories.map(item => item.slug)).size, initialCategories.length)
  assert.equal(new Set(initialTemplates.map(item => item.slug)).size, initialTemplates.length)
  assert.ok(initialTemplates.every(item => item.demoStatus === 'unavailable' && item.demoUrl === null))
  assert.ok(initialTemplates.every(item => item.shortDescription && item.features.length > 0))
})
