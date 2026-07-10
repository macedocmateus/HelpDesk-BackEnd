import { Router } from 'express'

import { adminsRoutes } from './admins-routes.js'
import { techniciansRoutes } from './technicians-routes.js'
import { sessionsRoutes } from './sessions-routes.js'
import { customersRoutes } from './customers-routes.js'

const routes = Router()

routes.use('/admins', adminsRoutes)
routes.use('/technicians', techniciansRoutes)
routes.use('/sessions', sessionsRoutes)
routes.use('/customers', customersRoutes)

export { routes }
