import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { rateLimit } from 'express-rate-limit'
import Category from '../models/Category.js'
import Template from '../models/Template.js'
import Enquiry from '../models/Enquiry.js'
import { requireAdmin } from '../middleware/adminAuth.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { categorySchema, parseBody, templateSchema } from '../utils/validation.js'

const router = Router()
const loginLimit = rateLimit({ windowMs: 15 * 60 * 1000, limit: 5, standardHeaders: 'draft-8', legacyHeaders: false })
const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.COOKIE_SECURE === 'true' || process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/api/admin',
  maxAge: 8 * 60 * 60 * 1000
})
const objectId = /^[a-f\d]{24}$/i
const statuses = ['New', 'Contacted', 'Reviewing', 'Quotation Sent', 'Approved', 'Rejected', 'Converted']
let adminPasswordHash

router.post('/login', loginLimit, asyncHandler(async (req, res) => {
  const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : ''
  const password = typeof req.body?.password === 'string' ? req.body.password : ''
  if (!email || !password || email !== process.env.ADMIN_EMAIL.trim().toLowerCase() || password.length > 200) {
    return res.status(401).json({ error: 'Invalid email or password' })
  }
  adminPasswordHash ||= bcrypt.hash(process.env.ADMIN_PASSWORD, 10)
  const matches = await bcrypt.compare(password, await adminPasswordHash)
  if (!matches) return res.status(401).json({ error: 'Invalid email or password' })

  const token = jwt.sign({ sub: email, role: 'admin' }, process.env.JWT_SECRET, { algorithm: 'HS256', expiresIn: '8h' })
  res.cookie('marketplaceAdmin', token, cookieOptions())
  res.json({ admin: { email, role: 'admin' } })
}))

router.post('/logout', (_req, res) => {
  res.clearCookie('marketplaceAdmin', { ...cookieOptions(), maxAge: undefined })
  res.status(204).end()
})

router.get('/session', requireAdmin, (req, res) => res.json({ admin: req.admin }))
router.use(requireAdmin)

router.get('/overview', asyncHandler(async (_req, res) => {
  const [totalTemplates, publishedTemplates, draftTemplates, websiteTemplates, dashboardTemplates, webApplications, totalEnquiries, pendingEnquiries] = await Promise.all([
    Template.countDocuments(),
    Template.countDocuments({ published: true }),
    Template.countDocuments({ published: false }),
    Template.countDocuments({ type: 'website' }),
    Template.countDocuments({ type: 'admin-dashboard' }),
    Template.countDocuments({ type: 'web-application' }),
    Enquiry.countDocuments(),
    Enquiry.countDocuments({ status: { $in: ['New', 'Reviewing', 'Quotation Sent'] } })
  ])
  res.json({ totalTemplates, publishedTemplates, draftTemplates, websiteTemplates, dashboardTemplates, webApplications, totalEnquiries, pendingEnquiries })
}))

router.get('/templates', asyncHandler(async (req, res) => {
  const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1)
  const limit = Math.min(100, Math.max(1, Number.parseInt(req.query.limit, 10) || 30))
  const filter = {}
  if (['website', 'admin-dashboard', 'web-application'].includes(req.query.type)) filter.type = req.query.type
  if (req.query.published === 'true' || req.query.published === 'false') filter.published = req.query.published === 'true'
  const [templates, total] = await Promise.all([
    Template.find(filter).populate('category', 'name slug type').sort({ updatedAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Template.countDocuments(filter)
  ])
  res.json({ templates, pagination: { page, limit, total, pages: Math.ceil(total / limit) } })
}))

router.post('/templates', asyncHandler(async (req, res) => {
  const data = parseBody(templateSchema, req.body)
  const category = await Category.findOne({ _id: data.category, active: true }).select('_id type').lean()
  if (!category) return res.status(400).json({ error: 'Select an active category' })
  if (category.type !== data.type) return res.status(400).json({ error: 'Template type must match its category type' })
  const template = await Template.create(data)
  res.status(201).json({ template })
}))

router.put('/templates/:id', asyncHandler(async (req, res) => {
  if (!objectId.test(req.params.id)) return res.status(400).json({ error: 'Invalid template id' })
  const data = parseBody(templateSchema, req.body)
  const category = await Category.findOne({ _id: data.category, active: true }).select('_id type').lean()
  if (!category) return res.status(400).json({ error: 'Select an active category' })
  if (category.type !== data.type) return res.status(400).json({ error: 'Template type must match its category type' })
  const template = await Template.findByIdAndUpdate(req.params.id, data, { returnDocument: 'after', runValidators: true }).populate('category', 'name slug type')
  if (!template) return res.status(404).json({ error: 'Template not found' })
  res.json({ template })
}))

router.delete('/templates/:id', asyncHandler(async (req, res) => {
  if (!objectId.test(req.params.id)) return res.status(400).json({ error: 'Invalid template id' })
  if (await Enquiry.exists({ template: req.params.id })) {
    return res.status(409).json({ error: 'This template has enquiry history; unpublish it to preserve the record.' })
  }
  const template = await Template.findByIdAndDelete(req.params.id)
  if (!template) return res.status(404).json({ error: 'Template not found' })
  res.status(204).end()
}))

router.get('/categories', asyncHandler(async (_req, res) => {
  const categories = await Category.find().sort({ order: 1, name: 1 }).lean()
  res.json({ categories })
}))

router.post('/categories', asyncHandler(async (req, res) => {
  const category = await Category.create(parseBody(categorySchema, req.body))
  res.status(201).json({ category })
}))

router.put('/categories/:id', asyncHandler(async (req, res) => {
  if (!objectId.test(req.params.id)) return res.status(400).json({ error: 'Invalid category id' })
  const data = parseBody(categorySchema, req.body)
  const current = await Category.findById(req.params.id).select('type').lean()
  if (!current) return res.status(404).json({ error: 'Category not found' })
  if (current.type !== data.type && await Template.exists({ category: req.params.id })) {
    return res.status(409).json({ error: 'Reassign this category’s templates before changing its type' })
  }
  const category = await Category.findByIdAndUpdate(req.params.id, data, { returnDocument: 'after', runValidators: true })
  res.json({ category })
}))

router.delete('/categories/:id', asyncHandler(async (req, res) => {
  if (!objectId.test(req.params.id)) return res.status(400).json({ error: 'Invalid category id' })
  if (await Template.exists({ category: req.params.id })) return res.status(409).json({ error: 'This category still has templates assigned; reassign them before deleting it' })
  const category = await Category.findByIdAndDelete(req.params.id)
  if (!category) return res.status(404).json({ error: 'Category not found' })
  res.status(204).end()
}))

router.get('/enquiries', asyncHandler(async (req, res) => {
  const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1)
  const limit = Math.min(100, Math.max(1, Number.parseInt(req.query.limit, 10) || 30))
  const filter = {}
  if (statuses.includes(req.query.status)) filter.status = req.query.status
  const search = typeof req.query.q === 'string' ? req.query.q.trim().slice(0, 100) : ''
  if (search) {
    const pattern = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
    filter.$or = [{ name: pattern }, { email: pattern }, { reference: pattern }, { templateName: pattern }]
  }
  const [enquiries, total] = await Promise.all([
    Enquiry.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Enquiry.countDocuments(filter)
  ])
  res.json({ enquiries, pagination: { page, limit, total, pages: Math.ceil(total / limit) } })
}))

router.patch('/enquiries/:id', asyncHandler(async (req, res) => {
  if (!objectId.test(req.params.id)) return res.status(400).json({ error: 'Invalid enquiry id' })
  const updates = {}
  if (Object.hasOwn(req.body || {}, 'status')) {
    if (!statuses.includes(req.body.status)) return res.status(400).json({ error: 'Invalid enquiry status' })
    updates.status = req.body.status
  }
  if (typeof req.body?.internalNote === 'string' && req.body.internalNote.trim()) {
    const note = req.body.internalNote.trim()
    if (note.length > 2000) return res.status(400).json({ error: 'Internal note is too long' })
    updates.$push = { internalNotes: { body: note, author: req.admin.email } }
  }
  if (!Object.keys(updates).length) return res.status(400).json({ error: 'Provide a status or internal note' })
  const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, updates, { returnDocument: 'after', runValidators: true }).lean()
  if (!enquiry) return res.status(404).json({ error: 'Enquiry not found' })
  res.json({ enquiry })
}))

export default router
