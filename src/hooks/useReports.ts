import { useQuery } from '@tanstack/react-query'
import i18n from '../i18n'
import apiClient from '../services/apiClient'

export interface Report {
  method: string
  purpose: string
  licensePlateNumber?: string | null
  startKm?: number | null
  endKm?: number | null
  externalOrganization?: string | null
  externalRepresentative?: string | null
  description?: string | null
  submittedAt: string
  author?: string
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
    refetchOnWindowFocus: false,
  })

export const usePostReport = (id: string, r: dataOmit) =>
  apiClient.post(
    `/assignments/${id}/report`,
    {
      purpose: r.purpose,
      method: r.method,
      description: r.description || undefined,
      endKm: r.endKm || undefined,
      startKm: r.startKm || undefined,
      externalOrganization: r.externalOrganization || undefined,
      externalRepresentative: r.externalRepresentative || undefined,
      licensePlateNumber: r.licensePlateNumber || undefined,
    },
    {
      headers: {
        'x-plander-auth':
          localStorage.getItem('token') || sessionStorage.getItem('token'),
        'Accept-Language': i18n.language,
      },
    },
  )

export const useDeleteReport = (id: string) =>
  apiClient.delete(`/assignments/${id}/report`, {
    headers: {
      'x-plander-auth':
        localStorage.getItem('token') || sessionStorage.getItem('token'),
      'Accept-Language': i18n.language,
    },
  })

export const useReportPDF = (id: string) =>
  apiClient
    .get(`/assignments/${id}/report/pdf`, {
      headers: {
        'x-plander-auth':
          localStorage.getItem('token') || sessionStorage.getItem('token'),
        'Accept-Language': i18n.language,
      },
      responseType: 'blob',
    })
    .then((res) => {
      const fileName =
        res.headers['Content-Disposition']?.split(';')[1].split('=')[1] ??
        `report_${id}.pdf`
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', fileName)
      link.click()
    })

export const usePatchReport = (id: string, r: dataOmit) =>
  apiClient.patch(`/assignments/${id}/report`, r, {
    headers: {
      'x-plander-auth':
        localStorage.getItem('token') || sessionStorage.getItem('token'),
      'Accept-Language': i18n.language,
    },
  })

export type dataOmit = Omit<Report, '_id' | 'submittedAt' | 'author'>
