import { Router } from 'express'
import { addProjects, deleteProjects, getProjects, updateProjects } from '../controllers/project.controller.js'
import upload from '../middleware/multer.middleware.js'
import { authenticateToken } from '../middleware/auth.middleware.js'

const router = Router()


router.post('/projects', authenticateToken, upload.single("image"), addProjects)
router.get('/projects', getProjects)

router.put('/project/:id', authenticateToken, upload.single('image'), updateProjects)
router.delete('/project/:id', authenticateToken, deleteProjects)                        


export default router