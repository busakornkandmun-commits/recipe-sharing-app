import { Link } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { User } from './User.jsx'
import { useAuth } from '../contexts/AuthContext.jsx'

export function Header() {
  const [token, setToken] = useAuth()

  if (token) {
    const { sub } = jwtDecode(token)

    return (
      <div>
        <h1>Recipe Sharing!</h1>

        <div>
          Logged in as <User id={sub} />
        </div>

        <div style={{ marginTop: '12px' }}>
          <button onClick={() => setToken(null)}>Logout</button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1>Recipe Sharing!</h1>
      <Link to='/login'>Log In</Link> | <Link to='/signup'>Sign Up</Link>
    </div>
  )
}
