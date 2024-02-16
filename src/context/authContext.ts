import React, { SetStateAction } from 'react'
import { User } from '../hooks/useLogin'

interface AuthContextType {
  user: User
  setUser: React.Dispatch<SetStateAction<User>>
  token: string
  setToken: React.Dispatch<SetStateAction<string>>
}
export const AuthContext = React.createContext<AuthContextType>(
  {} as AuthContextType,
)
