import { Router } from 'express'
import { randomUUID } from 'node:crypto'
import Enquiry from '../models/Enquiry.js'
import Template from '../models/Template.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { enquirySchema, parseBody } from '../utils/validation.js'
import { rateLimit } from 'express-rate-limit'

const router = Router()
const submitLimit = rateLimit({ windowMs: 60 * 60 * 1000, limit: 5, standardHeaders: 'draft-8', legacyHeaders: false, message: { error: 'Too many enquiry attempts. Please try again later.' } })

router.post('/', submitLimit, asyncHandler(async (req, res) => {
  const data = parseBody(enquirySchema, req.body)
  let template = null
  if (data.templateSlug) {
    template = await Template.findOne({ slug: data.templateSlug, published: true }).select('_id name').lean()
    if (!template) return res.status(400).json({ error: 'The selected template is unavailable' })
  }

  const enquiry = await Enquiry.create({
    ...data,
    reference: `CP-${randomUUID().split('-')[0].toUpperCase()}`,
    template: template?._id || null,
    templateName: template?.name || ''
  })
  res.status(201).json({ message: 'Enquiry received', reference: enquiry.reference })
}))

export default router
