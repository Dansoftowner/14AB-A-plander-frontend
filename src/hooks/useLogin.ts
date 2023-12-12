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
      if (res.status === 200) {
        localStorage.setItem('token', res.data)
        return true
      }
    })
    .catch((err) => {
      return err.response.data
    })

export const useLogout = () =>
  apiClient.post('/logout').then((res) => {
    localStorage.removeItem('token')
    return res.data
  })
