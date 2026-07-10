import { Router } from 'express';

import { CustomersController } from '#/controllers/customers-controller.js';

import { ensureAuthenticated } from '#/middlewares/ensure-authenticated.js'
import { verifyUserAuthorization } from '#/middlewares/verifyUserAuthorization.js'

const customersRoutes = Router()
const customersController = new CustomersController()

customersRoutes.post('/', customersController.create)
customersRoutes.get('/', ensureAuthenticated, verifyUserAuthorization(['admin']), customersController.index)
customersRoutes.patch('/:id', ensureAuthenticated, verifyUserAuthorization(['admin', 'customer']), customersController.update)
customersRoutes.delete('/:id', ensureAuthenticated, verifyUserAuthorization(['admin', 'customer']), customersController.remove)

export { customersRoutes }
