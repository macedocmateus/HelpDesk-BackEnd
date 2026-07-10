import { Router } from 'express'
import { TechniciansController } from '#/controllers/technicians-controller.js'
import { upload } from '#/lib/multer.js'

import { ensureAuthenticated } from '#/middlewares/ensure-authenticated.js'
import { verifyUserAuthorization } from '#/middlewares/verifyUserAuthorization.js'
import { ensureOwnsAvatar } from '#/middlewares/ensure-owns-avatar.js'

const techniciansRoutes = Router()
const techniciansController = new TechniciansController()

techniciansRoutes.post('/', ensureAuthenticated, verifyUserAuthorization(['admin']), techniciansController.create)
techniciansRoutes.get('/', ensureAuthenticated, verifyUserAuthorization(['admin']), techniciansController.index)
techniciansRoutes.patch('/:id', ensureAuthenticated, verifyUserAuthorization(['admin', 'technician']), techniciansController.update)
techniciansRoutes.patch('/:id/password', ensureAuthenticated, verifyUserAuthorization(['technician', 'admin']), techniciansController.updatePassword)
techniciansRoutes.patch(
  '/:id/hours', ensureAuthenticated, verifyUserAuthorization(['admin']),
  techniciansController.updateAvailableHours,
)
techniciansRoutes.patch(
  '/:id/avatar',
  ensureAuthenticated, verifyUserAuthorization(['technician']), ensureOwnsAvatar ,upload.single('avatar'), techniciansController.updateAvatar,
)

export { techniciansRoutes }
