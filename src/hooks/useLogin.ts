import i18n from '../i18n'
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
export interface UserWithAssociation extends User {
  association: {
    _id: string
    name: string
  }
}

export const useLogin = (login: Login, storeMode: Storage) =>
  apiClient
    .post('/auth', login, {
      headers: {
        'Accept-Language': i18n.language,
      },
    })
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
