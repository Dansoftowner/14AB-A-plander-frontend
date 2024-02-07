import { useQuery } from '@tanstack/react-query'
import i18n from '../i18n'
import apiClient from '../services/apiClient'

interface Report {}

export const useReport = (id: string) =>
  useQuery<Report>({
    queryKey: ['report', id],
    queryFn: () =>
      apiClient
        .get(`/assignments/${id}/report`, {
          headers: {
            'x-plander-auth':
              localStorage.getItem('token') || sessionStorage.getItem('token'),
            'Accept-Language': i18n.language,
          },
        })
        .then((res) => res.data),
    retry: 1,
  })

export const useDeleteReport = (id: string) =>
  apiClient.delete(`/assignments/${id}/report`, {
    headers: {
      'x-plander-auth':
        localStorage.getItem('token') || sessionStorage.getItem('token'),
      'Accept-Language': i18n.language,
    },
  })

export const useReportPDF = (id: string) =>
  apiClient.get(`/assignments/${id}/report/pdf`, {
    headers: {
      'x-plander-auth':
        localStorage.getItem('token') || sessionStorage.getItem('token'),
      'Accept-Language': i18n.language,
    },
  })
