import mongoose from 'mongoose'

const enquirySchema = new mongoose.Schema({
  reference: { type: String, required: true, unique: true, index: true },
  businessName: { type: String, trim: true, maxlength: 120, default: '' },
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
  phone: { type: String, trim: true, maxlength: 30, default: '' },
  template: { type: mongoose.Schema.Types.ObjectId, ref: 'Template', default: null },
  templateName: { type: String, trim: true, maxlength: 120, default: '' },
  businessDescription: { type: String, required: true, trim: true, maxlength: 5000 },
  pages: [{ type: String, trim: true, maxlength: 100 }],
  features: [{ type: String, trim: true, maxlength: 160 }],
  designPreferences: { type: String, trim: true, maxlength: 1000, default: '' },
  referenceUrls: [{ type: String, trim: true, maxlength: 500 }],
  domainHosting: { type: String, trim: true, maxlength: 500, default: '' },
  budget: { type: String, trim: true, maxlength: 80, default: '' },
  expectedDelivery: { type: String, trim: true, maxlength: 80, default: '' },
  comments: { type: String, trim: true, maxlength: 3000, default: '' },
  status: { type: String, enum: ['New', 'Contacted', 'Reviewing', 'Quotation Sent', 'Approved', 'Rejected', 'Converted'], default: 'New', index: true },
  internalNotes: [{ body: { type: String, trim: true, maxlength: 2000 }, author: { type: String, maxlength: 254 }, createdAt: { type: Date, default: Date.now } }]
}, { timestamps: true })

enquirySchema.index({ email: 1, createdAt: -1 })
export default mongoose.model('TemplateEnquiry', enquirySchema)
