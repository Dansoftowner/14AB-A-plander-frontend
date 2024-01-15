import apiClient from '../services/apiClient'

const useTransfer = (_id: string, password: string) =>
  apiClient.patch(`/members/transfer-my-roles/${_id}?q=true`, {
    headers: {
      'x-plander-auth':
        localStorage.getItem('token') || sessionStorage.getItem('token'),
      'x-current-pwd': password,
    },
  })
