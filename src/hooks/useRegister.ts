import { useQuery } from '@tanstack/react-query'
import apiClient from '../services/apiClient'

export const useRegister = (id: string, registrationToken: string) => {
  useQuery({
    queryKey: ['register', id, registrationToken],
    queryFn: () => {
      apiClient
        .post('/members/register/:id/:registrationToken', {
          id,
          registrationToken,
        })
        .then((res) => res.data)
    },
  })
}
