import { Router } from 'express'
import Category from '../models/Category.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = Router()

router.get('/', asyncHandler(async (_req, res) => {
  const categories = await Category.find({ active: true }).sort({ order: 1, name: 1 }).lean()
  res.json({ categories })
}))

export default router
