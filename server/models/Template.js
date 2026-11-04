import mongoose from 'mongoose'
import { slugPattern } from '../utils/slug.js'

const templateSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  slug: { type: String, required: true, unique: true, lowercase: true, match: slugPattern, maxlength: 140 },
  shortDescription: { type: String, required: true, trim: true, maxlength: 280 },
  fullDescription: { type: String, required: true, trim: true, maxlength: 4000 },
  type: { type: String, enum: ['website', 'admin-dashboard', 'web-application'], required: true, index: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'TemplateCategory', required: true, index: true },
  industry: { type: String, trim: true, maxlength: 80, default: 'General' },
  thumbnail: { type: String, trim: true, maxlength: 500, default: '' },
  gallery: [{ type: String, trim: true, maxlength: 500 }],
  features: [{ type: String, trim: true, maxlength: 160 }],
  technologies: [{ type: String, trim: true, maxlength: 40 }],
  integrations: [{ type: String, trim: true, maxlength: 80 }],
  customization: [{ type: String, trim: true, maxlength: 120 }],
  pricingType: { type: String, enum: ['free', 'fixed', 'custom'], required: true, default: 'custom' },
  price: { type: Number, min: 0, default: null },
  currency: { type: String, enum: ['INR'], default: 'INR' },
  demoUrl: { type: String, trim: true, maxlength: 500, default: null },
  demoStatus: { type: String, enum: ['available', 'unavailable', 'restricted'], default: 'unavailable' },
  responsive: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  popular: { type: Boolean, default: false },
  published: { type: Boolean, default: false },
  seoTitle: { type: String, trim: true, maxlength: 70, default: '' },
  seoDescription: { type: String, trim: true, maxlength: 170, default: '' },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true })

templateSchema.index({ published: 1, featured: 1, createdAt: -1 })
templateSchema.index({ name: 'text', shortDescription: 'text', fullDescription: 'text', industry: 'text', technologies: 'text', features: 'text' })
templateSchema.index({ pricingType: 1, price: 1 })

templateSchema.pre('validate', function validateDemo() {
  if (!this.demoUrl) this.demoStatus = 'unavailable'
  if (this.pricingType === 'custom') this.price = null
  if (this.pricingType === 'free') this.price = 0
})

export default mongoose.model('Template', templateSchema)
