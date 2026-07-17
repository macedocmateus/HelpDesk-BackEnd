import { Router } from 'express'
import { TicketsController } from '#/controllers/tickets-controller.js'
import { ensureAuthenticated } from '#/middlewares/ensure-authenticated.js'
import { verifyUserAuthorization } from '#/middlewares/verifyUserAuthorization.js'

const ticketsRoutes = Router()
const ticketsController = new TicketsController()

ticketsRoutes.post(
  '/',
  ensureAuthenticated,
  verifyUserAuthorization(['customer']),
  ticketsController.create,
)
ticketsRoutes.get('/', ensureAuthenticated, ticketsController.index)
ticketsRoutes.patch(
  '/:id/services',
  ensureAuthenticated,
  verifyUserAuthorization(['technician']),
  ticketsController.addServices,
)
ticketsRoutes.patch(
  '/:id/status',
  ensureAuthenticated,
  verifyUserAuthorization(['technician', 'admin']),
  ticketsController.updateStatus,
)

export { ticketsRoutes }
