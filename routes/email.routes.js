import { Router } from 'express'
import { authenticateToken } from '../middleware/auth.middleware.js'
import { subscribeEmail } from '../controllers/contact.controller.js'
import { emailLimiter } from '../middleware/ratelimiter.js'

const router = Router()

router.post('/email', emailLimiter, subscribeEmail)


export default router