import cors from 'cors'
import express from 'express'
import { env } from '#/env.js'
import { errorHandling } from './middlewares/error-handling.js'
import { routes } from './routes/index.js'

const app = express()

app.use(cors({ origin: env.FRONTEND_URL }))
app.use(express.json())

app.use(routes)

app.use(errorHandling)

export { app }
