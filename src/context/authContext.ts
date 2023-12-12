import React from 'react'
import { AuthAction } from '../reducers/authReducer'

interface AuthContextType {
  userId: string
  dispatch: React.Dispatch<AuthAction>
}
export const AuthContext = React.createContext<AuthContextType>(
  {} as AuthContextType,
)
