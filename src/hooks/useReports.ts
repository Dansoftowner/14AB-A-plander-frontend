import { useQuery } from '@tanstack/react-query'
import i18n from '../i18n'
import apiClient from '../services/apiClient'

export interface Report {
  method: string
  purpose: string
  licensePlateNumber?: string
  startKm?: number
  endKm?: number
  externalOrganization?: string
  externalRepresentative?: string
  description?: string
  submittedAt: string
}

export const useReport = (id: string) =>
  useQuery({
    queryKey: ['report', id],
    queryFn: () =>
      apiClient
        .get<Report>(`/assignments/${id}/report`, {
          headers: {
            'x-plander-auth':
              localStorage.getItem('token') || sessionStorage.getItem('token'),
            'Accept-Language': i18n.language,
          },
        })
        .then((res) => res.data)
        .catch((err) => console.log(err)),
    retry: 1,
  })

export const usePostReport = (id: string, r: Report) =>
  apiClient.post(`/assignments/${id}/report`, r, {
    headers: {
      'x-plander-auth':
        localStorage.getItem('token') || sessionStorage.getItem('token'),
      'Accept-Language': i18n.language,
    },
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
