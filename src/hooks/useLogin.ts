import apiClient from '../services/apiClient'

export interface Login {
  associationId: string | undefined
  user: string
  password: string
}

export interface User {
  _id: string
  isRegistered: boolean
  email: string
  username: string
  name: string
  address: string
  idNumber: string
  phoneNumber: string
  guardNumber: string
  roles: string[]
}

export const useLogin = (login: Login, storeMode: Storage) =>
  apiClient
    .post('/auth', login)
    .then((res) => {
      if (res.status === 200) {
        storeMode.setItem('user', JSON.stringify(res.data))
        storeMode.setItem('token', res.headers['x-plander-auth'])
        return true
      }
    })
    .catch((err) => {
      return err
    })
