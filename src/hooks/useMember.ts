import { useQuery } from '@tanstack/react-query'
import apiClient from '../services/apiClient'

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

export const useLoginForMe = () =>
  useQuery<User>({
    queryKey: ['loginForMe'],
    queryFn: async () =>
      await apiClient.get(`/members/me`).then((res) => res.data),
    staleTime: 1000 * 60,
    retry: 1,
  })
