import { Router } from 'express'
import { AiAgent } from '../controllers/ai.controller.js'

const router = Router()

router.post('/ai', AiAgent)


export default router