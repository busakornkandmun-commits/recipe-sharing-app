import { createUser, loginUser, getUserInfoById } from '../services/users.js'

export function userRoutes(app) {
  console.log('Registering user routes...')

  app.get('/api/v1/users/:id', async (req, res) => {
    console.log('Matched user route:', req.params.id)

    try {
      const userInfo = await getUserInfoById(req.params.id)
      return res.status(200).json(userInfo)
    } catch (err) {
      console.error('Error fetching user:', err)
      return res.status(500).json({ error: 'Failed to fetch user' })
    }
  })

  app.post('/api/v1/user/signup', async (req, res) => {
    try {
      const user = await createUser(req.body)
      return res.status(201).json({ username: user.username })
    } catch (err) {
      return res.status(400).json({
        error: 'failed to create the user, does the username already exist?',
      })
    }
  })

  app.post('/api/v1/user/login', async (req, res) => {
    try {
      const token = await loginUser(req.body)
      return res.status(200).json({ token })
    } catch (err) {
      return res.status(400).json({
        error: 'login failed, did you enter the correct username/password?',
      })
    }
  })
}
