import apiClient from '../services/apiClient'
import jwt_decode, { jwtDecode } from 'jwt-decode'

export interface Login {
  associationId: string | undefined
  user: string
  password: string
  isAutoLogin: boolean
}

export const useLogin = (login: Login) =>
  apiClient
    .post('/auth', login)
    .then((res) => {
      const token = res.data
      const user = jwtDecode(token)
      console.log(user)
    })
    .catch((err) => console.log(err))
