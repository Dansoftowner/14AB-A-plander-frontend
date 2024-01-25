import { useQuery } from '@tanstack/react-query'
import apiClient from '../services/apiClient'
import i18n from '../i18n'

interface Assignment {
  _id: string
  title: string
  location: string
  start: string
  end: string
  assignees: [
    {
      _id: string
      name: string
    },
  ]
}

export interface AssignmentsQuery {
  start: string
  end: string
  projection: string
  orderBy: string
}

interface Response {
  metadata: { start: string; end: string }
  items: Assignment[]
}

export const useAssignments = (query: AssignmentsQuery) =>
  useQuery<Response>({
    queryKey: ['assignments', query.start, query.end],
    queryFn: () =>
      apiClient
        .get('/assignments', {
          params: {
            start: query.start,
            end: query.end,
            projection: query.projection,
            orderBy: query.orderBy,
          },
          headers: {
            'x-plander-auth':
              localStorage.getItem('token') || sessionStorage.getItem('token'),
            'Accept-Language': i18n.language,
          },
        })
        .then((res) => res.data),
  })
