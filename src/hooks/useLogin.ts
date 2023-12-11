import apiClient from '../services/apiClient'

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
      return res.status === 200
    })
    .catch((err) => {
      return err.response.data
    })

export const useLogout = () =>
  apiClient.post('/logout').then((res) => {
    return res.data
  })
