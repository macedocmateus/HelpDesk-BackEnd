import { Router } from 'express'

import { adminsRoutes } from './admins-routes.js'
import { techniciansRoutes } from './technicians-routes.js'

const routes = Router()

routes.use('/admins', adminsRoutes)
routes.use('/technicians', techniciansRoutes)

export { routes }
