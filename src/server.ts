import { app } from '#/app.js'
//import { env } from './env.js'

const PORT = 3333
//const PORT = env.PORT

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
