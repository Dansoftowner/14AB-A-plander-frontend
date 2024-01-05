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
      if (res.status === 202) return true
    })
    .catch((err) => {
      return err
    })
