import { Router } from 'express'
import mongoose from 'mongoose'
import Template from '../models/Template.js'
import Category from '../models/Category.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { escapeRegex } from '../utils/slug.js'

const router = Router()
const sortFields = {
  latest: { createdAt: -1 },
  popular: { popular: -1, createdAt: -1 },
  'price-low': { price: 1, createdAt: -1 },
  'price-high': { price: -1, createdAt: -1 }
}

router.get('/featured', asyncHandler(async (_req, res) => {
  const templates = await Template.find({ published: true, featured: true }).populate('category', 'name slug type').sort({ createdAt: -1 }).limit(12).lean()
  res.json({ templates })
}))

router.get('/popular', asyncHandler(async (_req, res) => {
  const templates = await Template.find({ published: true, popular: true }).populate('category', 'name slug type').sort({ createdAt: -1 }).limit(12).lean()
  res.json({ templates })
}))

router.get('/', asyncHandler(async (req, res) => {
  const { q = '', type, category, industry, technologies, pricingType, minPrice, maxPrice, responsive, featured, popular, sort = 'latest' } = req.query
  const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1)
  const limit = Math.min(48, Math.max(1, Number.parseInt(req.query.limit, 10) || 12))
  const filter = { published: true }

  if (type && ['website', 'admin-dashboard', 'web-application'].includes(type)) filter.type = type
  if (category) {
    const categoryDoc = await Category.findOne({ slug: String(category), active: true }).select('_id').lean()
    if (!categoryDoc) return res.json({ templates: [], pagination: { page, limit, total: 0, pages: 0 } })
    filter.category = categoryDoc._id
  }
  if (industry) filter.industry = new RegExp(`^${escapeRegex(String(industry).slice(0, 80))}$`, 'i')
  if (technologies) filter.technologies = { $in: String(technologies).split(',').slice(0, 10).map(value => new RegExp(`^${escapeRegex(value.slice(0, 40))}$`, 'i')) }
  if (['free', 'fixed', 'custom'].includes(pricingType)) filter.pricingType = pricingType
  if (responsive === 'true' || responsive === 'false') filter.responsive = responsive === 'true'
  if (featured === 'true') filter.featured = true
  if (popular === 'true') filter.popular = true
  if (minPrice || maxPrice) {
    filter.price = {}
    if (Number.isFinite(Number(minPrice))) filter.price.$gte = Math.max(0, Number(minPrice))
    if (Number.isFinite(Number(maxPrice))) filter.price.$lte = Math.max(0, Number(maxPrice))
  }
  const query = String(q).trim().slice(0, 100)
  if (minPrice && maxPrice && Number.isFinite(Number(minPrice)) && Number.isFinite(Number(maxPrice)) && Number(minPrice) > Number(maxPrice)) {
    return res.status(400).json({ error: 'Minimum price cannot exceed maximum price' })
  }
  if (query) {
    const safeQuery = new RegExp(escapeRegex(query), 'i')
    filter.$or = [
      { name: safeQuery }, { shortDescription: safeQuery }, { fullDescription: safeQuery },
      { industry: safeQuery }, { features: safeQuery }, { technologies: safeQuery }
    ]
  }
  const sortBy = sortFields[sort] || sortFields.latest
  const [templates, total] = await Promise.all([
    Template.find(filter).populate('category', 'name slug type').sort(sortBy).skip((page - 1) * limit).limit(limit).lean(),
    Template.countDocuments(filter)
  ])
  res.json({ templates, pagination: { page, limit, total, pages: Math.ceil(total / limit) } })
}))

router.get('/:slug', asyncHandler(async (req, res) => {
  const template = await Template.findOne({ slug: req.params.slug, published: true }).populate('category', 'name slug type').lean()
  if (!template) return res.status(404).json({ error: 'Template not found' })
  const related = await Template.find({ published: true, category: template.category._id, _id: { $ne: template._id } })
    .populate('category', 'name slug type').limit(4).lean()
  res.json({ template, related })
}))

export default router
