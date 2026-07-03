import { Router } from 'express'

import { AdminsController } from '#/controllers/admins-controller.js'

const adminsRoutes = Router()
const adminsController = new AdminsController()

adminsRoutes.post('/', adminsController.create)
adminsRoutes.get('/', adminsController.index)
adminsRoutes.patch('/:id', adminsController.update)
adminsRoutes.delete('/:id', adminsController.remove)

export { adminsRoutes }
