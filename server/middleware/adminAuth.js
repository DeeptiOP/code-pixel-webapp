import jwt from 'jsonwebtoken'

export function requireAdmin(req, res, next) {
  const token = req.cookies?.marketplaceAdmin
  if (!token) return res.status(401).json({ error: 'Administrator sign-in required' })

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] })
    if (payload.role !== 'admin') return res.status(403).json({ error: 'Administrator access required' })
    req.admin = { email: payload.sub, role: payload.role }
    return next()
  } catch {
    res.clearCookie('marketplaceAdmin', {
      sameSite: 'strict',
      secure: process.env.COOKIE_SECURE === 'true' || process.env.NODE_ENV === 'production',
      httpOnly: true,
      path: '/api/admin'
    })
    return res.status(401).json({ error: 'Administrator session expired; sign in again' })
  }
}
