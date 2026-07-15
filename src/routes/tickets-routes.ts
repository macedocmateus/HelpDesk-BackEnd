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

export { ticketsRoutes }
