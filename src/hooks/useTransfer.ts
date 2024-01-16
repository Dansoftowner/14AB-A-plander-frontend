import apiClient from '../services/apiClient'
import i18n from '../i18n'

export const useTransfer = (_id: string, password: string) =>
  apiClient
    .patch(`/members/transfer-my-roles/${_id}`, '', {
      params: {
        copy: true,
      },
      headers: {
        'x-plander-auth':
          localStorage.getItem('token') || sessionStorage.getItem('token'),
        'x-current-pwd': password,
        'Accept-Language': i18n.language,
      },
    })
    .then((res) => res)
    .catch((err) => err)
