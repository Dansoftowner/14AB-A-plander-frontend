import { useQuery } from '@tanstack/react-query'
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

export const useLoginForMe2 = () =>
  apiClient.get(`/members/me`).then((res) => {
    res.data
  })

export const useLoginForMe = () =>
  useQuery({
    queryKey: ['loginForMe'],
    queryFn: () => apiClient.get(`/members/me`).then((res) => res.data),
    staleTime: 1000 * 60,
  })

export const useLogout = () =>
  apiClient.post('/logout').then((res) => {
    return res.data
  })
