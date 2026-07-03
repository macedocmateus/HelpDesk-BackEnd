import { Router } from 'express'

import { adminsRoutes } from './admins-routes.js'

const routes = Router()

routes.use('/admins', adminsRoutes)

export { routes }
