import dotenv from 'dotenv'
dotenv.config()

import { initDatabase } from './db/init.js'
import { app } from './app.js'
const PORT = process.env.PORT || 3000
await initDatabase()

app.listen(PORT, '0.0.0.0', () => {
  console.info(`Express server running on port ${PORT}`)
})
