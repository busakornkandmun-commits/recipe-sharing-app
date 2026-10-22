import { createContext, useState, useContext } from 'react'
import PropTypes from 'prop-types'

export const AuthContext = createContext({
  token: null,
  setToken: () => { },
})

export const AuthContextProvider = ({ children }) => {
  const [token, setTokenState] = useState(
    () => localStorage.getItem('token'),
  )

  function setToken(newToken) {
    if (newToken) {
      localStorage.setItem('token', newToken)
    } else {
      localStorage.removeItem('token')
    }

    setTokenState(newToken)
  }

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  )
}

AuthContextProvider.propTypes = {
  children: PropTypes.element.isRequired,
}

export function useAuth() {
  const { token, setToken } = useContext(AuthContext)
  return [token, setToken]
}