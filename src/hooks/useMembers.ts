import { useQuery } from '@tanstack/react-query'
import apiClient from '../services/apiClient'
import { AsQuery } from './useAssociations'
import { User } from './useLogin'

interface Response {
  metadata: {
    offset: number
    limit: number
    total: number
  }
  items: User[]
}

export const useMembers = (q: AsQuery) =>
  useQuery<Response>({
    queryKey: ['members', q],
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

export const useRemoveMember = (id: string, pwd: string) =>
  apiClient.delete('/members/' + id, {
    headers: {
      'x-plander-auth':
        localStorage.getItem('token') || sessionStorage.getItem('token'),
      'x-current-pass': pwd,
    },
  })
