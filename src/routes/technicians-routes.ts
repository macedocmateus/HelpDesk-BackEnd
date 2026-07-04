import { Router } from 'express'
import { TechniciansController } from '#/controllers/technicians-controller.js'
import { upload } from '#/lib/multer.js'

const techniciansRoutes = Router()
const techniciansController = new TechniciansController()

techniciansRoutes.post('/', techniciansController.create)
techniciansRoutes.get('/', techniciansController.index)
techniciansRoutes.patch('/:id', techniciansController.update)
techniciansRoutes.patch('/:id/password', techniciansController.updatePassword)
techniciansRoutes.patch(
  '/:id/hours',
  techniciansController.updateAvailableHours,
)
techniciansRoutes.patch(
  '/:id/avatar',
  upload.single('avatar'),
  techniciansController.updateAvatar,
)

export { techniciansRoutes }
