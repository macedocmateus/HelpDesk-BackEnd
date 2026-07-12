import { Router } from 'express'

import { AdminsController } from '#/controllers/admins-controller.js'

import { ensureAuthenticated } from '#/middlewares/ensure-authenticated.js'
import { verifyUserAuthorization } from '#/middlewares/verifyUserAuthorization.js'

const adminsRoutes = Router()
const adminsController = new AdminsController()

adminsRoutes.post('/', adminsController.create)
adminsRoutes.get(
  '/',
  ensureAuthenticated,
  verifyUserAuthorization(['admin']),
  adminsController.index,
)
adminsRoutes.patch(
  '/:id',
  ensureAuthenticated,
  verifyUserAuthorization(['admin']),
  adminsController.update,
)
adminsRoutes.delete(
  '/:id',
  ensureAuthenticated,
  verifyUserAuthorization(['admin']),
  adminsController.remove,
)

export { adminsRoutes }
