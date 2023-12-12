import React from 'react'
import { AuthAction } from '../reducers/authReducer'
import { User } from '../hooks/useMember'

interface AuthContextType {
  user: User
  dispatch: React.Dispatch<AuthAction>
}
export const AuthContext = React.createContext<AuthContextType>(
  {} as AuthContextType,
)
