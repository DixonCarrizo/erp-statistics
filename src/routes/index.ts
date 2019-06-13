import { Router, Request, Response } from 'express'
import asteriskRoutes from './asterisk'
import dolibarr from './dolibarr'

export const router = Router()

router.use('/asterisk', asteriskRoutes)
router.use('/dolibarr', dolibarr)

router.get('/health', (req: Request, res: Response) => {
  console.log(req.query)
  res.sendStatus(200)
})

export default router