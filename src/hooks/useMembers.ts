import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import apiClient from '../services/apiClient'
import { AsQuery } from './useAssociations'
import { User } from './useLogin'
import i18n from '../i18n'
import { PhoneFormat } from '../components/PhoneDropdownList/phones'

interface Response {
  metadata: {
    offset?: number
    limit?: number
    total?: number
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

export const useInfiniteMembers = (q: AsQuery) =>
  useInfiniteQuery<Response>({
    queryKey: ['members', q],
    queryFn: ({ pageParam = 1 }) =>
      apiClient
        .get<Response>('/members', {
          params: {
            offset: (pageParam - 1) * q.limit,
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
    keepPreviousData: true,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.items.length > 0 ? allPages.length + 1 : undefined
    },
  })

export const useRemoveMember = (id: string, pwd: string) =>
  apiClient.delete('/members/' + id, {
    headers: {
      'x-plander-auth':
        localStorage.getItem('token') || sessionStorage.getItem('token'),
      'x-current-pass': pwd,
      'Accept-Language': i18n.language,
    },
  })

export const usePatchMember = (
  oldMember: User,
  member: User,
  phone: PhoneFormat,
) =>
  apiClient
    .patch(
      '/members/' + oldMember._id,
      {
        name: oldMember.name,
        address:
          member.address == oldMember.address
            ? oldMember.address
            : member.address,
        idNumber:
          member.idNumber == oldMember.idNumber
            ? oldMember.idNumber
            : member.idNumber,
        phoneNumber:
          member.phoneNumber == oldMember.phoneNumber
            ? oldMember.phoneNumber
            : member.phoneNumber,
        guardNumber:
          member.guardNumber == oldMember.guardNumber
            ? oldMember.guardNumber
            : phone.prefix + ' ' + member.guardNumber,
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
    .catch((err) => err)
