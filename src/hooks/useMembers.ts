import { useQuery } from '@tanstack/react-query'
import apiClient from '../services/apiClient'
import { AsQuery } from './useAssociations'

interface Response {
  metadata: {
    offset?: number
    limit?: number
    total?: number
  }
  items: Member[]
}

interface Member {
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

export const useMembers = (q: AsQuery) =>
  useQuery<Response>({
    queryKey: ['members'],
    queryFn: () =>
      apiClient
        .get<Response>('/members', {
          params: {
            offset: q.offset,
            limit: q.limit,
            projection: q.projection,
            orderBy: q.orderBy,
            q: q.q,
          },
          headers: {
            'x-plander-auth':
              localStorage.getItem('token') || sessionStorage.getItem('token'),
          },
        })
        .then((res) => res.data),
    staleTime: 1000 * 60,
  })
