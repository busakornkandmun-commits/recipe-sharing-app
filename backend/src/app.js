
import express from 'express'
import { postsRoutes } from './routes/posts.js'
import { userRoutes } from './routes/users.js'
import { recipesRoutes } from './routes/recipes.js'
import bodyParser from 'body-parser'
import cors from 'cors'

const app = express()

app.use(bodyParser.json())
app.use(cors())

postsRoutes(app)
userRoutes(app)
recipesRoutes(app)

// Temporary test route
app.get('/api/v1/test', (req, res) => {
  res.json({ message: 'API route is working!' })
})

app.get('/', (req, res) => {
  res.send('Hello from Express Nodemon!')
})

export { app }
