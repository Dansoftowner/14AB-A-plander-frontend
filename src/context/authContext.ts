import React, { SetStateAction } from 'react'
import { User } from '../hooks/useMember'

interface AuthContextType {
  user: User
  setUser: React.Dispatch<SetStateAction<User>>
}
export const AuthContext = React.createContext<AuthContextType>(
  {} as AuthContextType,
)
