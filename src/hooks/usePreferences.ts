import apiClient from '../services/apiClient'

export const usePreferences = () =>
  apiClient
    .get('/members/me/preferences', {
      headers: {
        'x-plander-auth':
          localStorage.getItem('token') || sessionStorage.getItem('token'),
      },
    })
    .then((res) => res.data)

export const usePatchPreferences = (data: any) =>
  apiClient
    .patch('/members/me/preferences', data, {
      headers: {
        'x-plander-auth':
          localStorage.getItem('token') || sessionStorage.getItem('token'),
      },
    })
    .then((res) => res)
