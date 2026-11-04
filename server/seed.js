import 'dotenv/config'
import mongoose from 'mongoose'
import Category from './models/Category.js'
import Template from './models/Template.js'
import { initialCategories, initialTemplates } from './data/initialTemplates.js'

if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is required to seed the marketplace')

await mongoose.connect(process.env.MONGODB_URI)
try {
  const categoriesByName = new Map()
  for (const [order, category] of initialCategories.entries()) {
    const saved = await Category.findOneAndUpdate(
      { slug: category.slug },
      { $setOnInsert: { ...category, order, active: true, description: `${category.name} website and application templates.` } },
      { upsert: true, returnDocument: 'after', runValidators: true }
    )
    categoriesByName.set(saved.name, saved._id)
  }

  for (const { categoryName, ...template } of initialTemplates) {
    await Template.updateOne(
      { slug: template.slug },
      { $setOnInsert: { ...template, category: categoriesByName.get(categoryName) } },
      { upsert: true, runValidators: true }
    )
  }
  console.log(`Marketplace seed complete: ${initialCategories.length} categories, ${initialTemplates.length} templates (existing records preserved).`)
} finally {
  await mongoose.disconnect()
}
