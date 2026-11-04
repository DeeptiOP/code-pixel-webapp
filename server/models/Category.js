import mongoose from 'mongoose'
import { slugPattern } from '../utils/slug.js'

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  slug: { type: String, required: true, unique: true, lowercase: true, match: slugPattern, maxlength: 90 },
  description: { type: String, trim: true, maxlength: 300, default: '' },
  type: { type: String, enum: ['website', 'admin-dashboard', 'web-application'], required: true },
  image: { type: String, trim: true, maxlength: 500, default: '' },
  order: { type: Number, min: 0, default: 0 },
  active: { type: Boolean, default: true }
}, { timestamps: true })

categorySchema.index({ active: 1, order: 1, name: 1 })
export default mongoose.model('TemplateCategory', categorySchema)
