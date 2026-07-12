import { Router } from 'express'

import { CustomersController } from '#/controllers/customers-controller.js'
import { upload } from '#/lib/multer.js'
import { ensureAuthenticated } from '#/middlewares/ensure-authenticated.js'

import { ensureOwnsAvatar } from '#/middlewares/ensure-owns-avatar.js'
import { verifyUserAuthorization } from '#/middlewares/verifyUserAuthorization.js'

const customersRoutes = Router()
const customersController = new CustomersController()

customersRoutes.post('/', customersController.create)
customersRoutes.get(
  '/',
  ensureAuthenticated,
  verifyUserAuthorization(['admin']),
  customersController.index,
)
customersRoutes.patch(
  '/:id',
  ensureAuthenticated,
  verifyUserAuthorization(['admin', 'customer']),
  customersController.update,
)
customersRoutes.delete(
  '/:id',
  ensureAuthenticated,
  verifyUserAuthorization(['admin', 'customer']),
  customersController.remove,
)
customersRoutes.patch(
  '/:id/avatar',
  ensureAuthenticated,
  verifyUserAuthorization(['customer']),
  ensureOwnsAvatar,
  upload.single('avatar'),
  customersController.updateAvatar,
)

export { customersRoutes }
