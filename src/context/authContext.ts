import React, { SetStateAction } from 'react'
import { User } from '../hooks/useLogin'

interface AuthContextType {
  user: User
  setUser: React.Dispatch<SetStateAction<User>>
  token: string
  setToken: React.Dispatch<SetStateAction<string>>
  preferences: any
  setPreferences: React.Dispatch<SetStateAction<any>>
}
export const AuthContext = React.createContext<AuthContextType>(
  {} as AuthContextType,
)
