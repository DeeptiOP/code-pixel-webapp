import { z } from 'zod'
import { slugPattern } from './slug.js'

const text = max => z.string().trim().max(max)
const optionalUrl = z.string().trim().url().max(500).refine(value => value.startsWith('https://'), 'URLs must use HTTPS').or(z.literal(''))
const stringList = (maxItems, maxLength) => z.array(text(maxLength)).max(maxItems).default([])
const booleanValue = z.boolean().default(false)
const categorySchema = z.object({
  name: text(80).min(1),
  slug: text(90).regex(slugPattern),
  description: text(300).optional().default(''),
  type: z.enum(['website', 'admin-dashboard', 'web-application']),
  image: optionalUrl.optional().default(''),
  order: z.number().int().min(0).max(10000).optional().default(0),
  active: booleanValue
}).strict()

const templateSchema = z.object({
  name: text(120).min(1),
  slug: text(140).regex(slugPattern),
  shortDescription: text(280).min(1),
  fullDescription: text(4000).min(1),
  type: z.enum(['website', 'admin-dashboard', 'web-application']),
  category: z.string().regex(/^[a-f\d]{24}$/i),
  industry: text(80).optional().default('General'),
  thumbnail: optionalUrl.optional().default(''),
  gallery: z.array(optionalUrl).max(12).optional().default([]),
  features: stringList(30, 160),
  technologies: stringList(20, 40),
  integrations: stringList(20, 80),
  customization: stringList(30, 120),
  pricingType: z.enum(['free', 'fixed', 'custom']),
  price: z.number().min(0).max(100000000).nullable().optional(),
  currency: z.literal('INR').optional().default('INR'),
  demoUrl: optionalUrl.nullable().optional().default(null),
  demoStatus: z.enum(['available', 'unavailable', 'restricted']).optional().default('unavailable'),
  responsive: booleanValue,
  featured: booleanValue,
  popular: booleanValue,
  published: booleanValue,
  seoTitle: text(70).optional().default(''),
  seoDescription: text(170).optional().default('')
}).strict().superRefine((item, ctx) => {
  if (item.pricingType === 'fixed' && item.price == null) {
    ctx.addIssue({ code: 'custom', path: ['price'], message: 'A fixed-price template requires a price' })
  }
  if (item.demoStatus === 'available' && !item.demoUrl) {
    ctx.addIssue({ code: 'custom', path: ['demoUrl'], message: 'An available demo requires a demo URL' })
  }
})

const enquirySchema = z.object({
  businessName: text(120).optional().default(''),
  name: text(100).min(1),
  email: z.string().trim().email().max(254),
  phone: text(30).optional().default(''),
  templateSlug: text(140).regex(slugPattern).optional().default(''),
  businessDescription: text(5000).min(10),
  pages: stringList(50, 100),
  features: stringList(50, 160),
  designPreferences: text(1000).optional().default(''),
  referenceUrls: z.array(optionalUrl).max(10).optional().default([]),
  domainHosting: text(500).optional().default(''),
  budget: text(80).optional().default(''),
  expectedDelivery: text(80).optional().default(''),
  comments: text(3000).optional().default('')
}).strict()

export const parseBody = (schema, input) => {
  const result = schema.safeParse(input)
  if (!result.success) {
    const error = new Error('Request validation failed')
    error.status = 400
    error.details = result.error.issues.map(issue => `${issue.path.join('.') || 'body'}: ${issue.message}`)
    throw error
  }
  return result.data
}

export { categorySchema, templateSchema, enquirySchema }
