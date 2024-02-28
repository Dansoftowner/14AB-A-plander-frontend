import { useQuery } from '@tanstack/react-query'
import apiClient from '../services/apiClient'
import i18n from '../i18n'

export interface Assignment {
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
  report?: string
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
    refetchOnWindowFocus: false,
  })

export const useAssignment = (_id: string) =>
  useQuery({
    queryKey: ['assignment', _id],
    queryFn: () =>
      apiClient
        .get(`/assignments/${_id}?projection=full`, {
          headers: {
            'x-plander-auth':
              localStorage.getItem('token') || sessionStorage.getItem('token'),
            'Accept-Language': i18n.language,
          },
        })
        .then((res) => res.data),
    retry: 1,
  })

export const usePostAssignment = (
  title: string,
  location: string,
  start: string,
  end: string,
  assignees: string[],
) =>
  apiClient
    .post(
      '/assignments',
      {
        title,
        location,
        // start: start.toISOString(),
        // end: end.toISOString(),
        start,
        end,
        assignees,
      },
      {
        headers: {
          'x-plander-auth':
            localStorage.getItem('token') || sessionStorage.getItem('token'),
          'Accept-Language': i18n.language,
        },
      },
    )
    .then((res) => res.data)

export const useDeleteAssignment = (_id: string) =>
  apiClient.delete(`/assignments/${_id}`, {
    headers: {
      'x-plander-auth':
        localStorage.getItem('token') || sessionStorage.getItem('token'),
      'Accept-Language': i18n.language,
    },
  })

export const usePatchAssignment = (
  _id: string,
  title: string,
  location: string,
  start: string,
  end: string,
  assignees: string[],
) =>
  apiClient.patch(
    `/assignments/${_id}`,
    {
      title,
      location,
      start,
      end,
      assignees,
    },
    {
      headers: {
        'x-plander-auth':
          localStorage.getItem('token') || sessionStorage.getItem('token'),
        'Accept-Language': i18n.language,
      },
    },
  )
