import { Router } from 'express'
import asteriskRoutes from './asterisk'
import dolibarr from './dolibarr'

export const router = Router()

router.use('/asterisk', asteriskRoutes)
router.use('/dolibarr', dolibarr)

export default router