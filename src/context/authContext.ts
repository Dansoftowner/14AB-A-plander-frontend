import React, { SetStateAction } from 'react'
import { AuthAction } from '../reducers/authReducer'
import { User } from '../hooks/useMember'

interface AuthContextType {
  user: User
  setUser: React.Dispatch<AuthAction>
  authToken: string
  setAuthToken: React.Dispatch<SetStateAction<string>>
}
export const AuthContext = React.createContext<AuthContextType>(
  {} as AuthContextType,
)
