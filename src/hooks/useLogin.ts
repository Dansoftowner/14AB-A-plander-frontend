import apiClient from '../services/apiClient'

export interface Login {
  associationId: string | undefined
  user: string
  password: string
  isAutoLogin: boolean
}

export const useLogin = (login: Login) =>
  apiClient
    .post<Login>('/auth', {
      associationId: login.associationId,
      user: login.user,
      password: login.password,
      isAutoLogin: login.isAutoLogin,
    })
    .then((res) => res.data)
    .catch((err) => console.log(err))
