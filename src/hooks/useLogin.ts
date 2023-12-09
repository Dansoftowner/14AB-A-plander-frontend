import { useReducer, useState } from 'react'
import apiClient from '../services/apiClient'
import { jwtDecode } from 'jwt-decode'
import authReducer from '../reducers/authReducer'

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
      const _token = res.data
      return _token
    })
    .catch((err) => {
      console.log(err)
    })

