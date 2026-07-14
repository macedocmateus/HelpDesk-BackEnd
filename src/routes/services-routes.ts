import { Router } from 'express'
import { ServicesController } from '#/controllers/services-controller.js'
import { ensureAuthenticated } from '#/middlewares/ensure-authenticated.js'
import { verifyUserAuthorization } from '#/middlewares/verifyUserAuthorization.js'

const servicesRoutes = Router()
const servicesController = new ServicesController()

servicesRoutes.post(
  '/',
  ensureAuthenticated,
  verifyUserAuthorization(['admin']),
  servicesController.create,
)
servicesRoutes.get('/', ensureAuthenticated, servicesController.index)
servicesRoutes.patch(
  '/:id',
  ensureAuthenticated,
  verifyUserAuthorization(['admin']),
  servicesController.update,
)
servicesRoutes.patch(
  '/:id/deactivate',
  ensureAuthenticated,
  verifyUserAuthorization(['admin']),
  servicesController.deactivate,
)

export { servicesRoutes }
