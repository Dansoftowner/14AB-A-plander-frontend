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
      console.log(err)
      return false
    })

export const useLoginForMe = () =>
  apiClient.get(`/members/me`).then((res) => {
    res.data
  })
