import express from 'express'
import { errorHandling } from './middlewares/error-handling.js'
import cors from 'cors'
import { routes } from './routes/index.js'
import { env } from '#/env.js'

const app = express()

app.use(cors({ origin: env.FRONTEND_URL }))
app.use(express.json())

app.use(routes)

app.use(errorHandling)

export { app }
