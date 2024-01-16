import i18n from '../i18n'
import apiClient from '../services/apiClient'
import { User } from './useLogin'

export const useCredentials = (
  member: User,
  oldMember: User,
  password: string,
  newPwd: string,
) =>
  apiClient
    .patch(
      '/members/me/credentials',
      {
        username:
          member.username === oldMember.username ? undefined : member.username,
        email: member.email === oldMember.email ? undefined : member.email,
        password: newPwd == 'KetajtosSzekreny' ? undefined : newPwd,
      },
      {
        headers: {
          'x-current-pass': password,
          'x-plander-auth':
            localStorage.getItem('token') || sessionStorage.getItem('token'),
          'Accept-Language': i18n.language,
        },
      },
    )
    .then((res) => res)
    .catch((err) => err)
