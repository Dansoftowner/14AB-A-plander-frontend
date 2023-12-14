import apiClient from '../services/apiClient'
import axios from 'axios'
import { useLoginForMe } from './useMember'

export interface Login {
  associationId: string | undefined
  user: string
  password: string
  isAutoLogin: boolean
}

export const useLogin = (login: Login, storeMode: Storage) =>
  apiClient
    .post('/auth', login)
    .then((res) => {
      if (res.status === 200) {
        storeMode.setItem('token', res.data)
        return true
      }
    })
    .catch((err) => {
      return err
    })

export const useLogout = () =>
  apiClient.post('/logout').then((res) => {
    localStorage.removeItem('token')
    return res.data
  })
