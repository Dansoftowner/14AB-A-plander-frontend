import i18n from '../i18n'
import apiClient from '../services/apiClient'

export const useResetPassword = (email: string, associationId: string) =>
  apiClient
    .post(
      'members/forgotten-password',
      { email, associationId },
      {
        headers: {
          'Accept-Language': i18n.language,
        },
      },
    )
    .then((res) => {
      if (res.status === 204) return true
    })
    .catch((err) => {
      return err
    })

export const useNewPassword = (
  id: string,
  restorationToken: string,
  body: any,
) =>
  apiClient
    .post(`members/forgotten-password/${id}/${restorationToken}`, {
      body,
    })
    .then((res) => res.data)
