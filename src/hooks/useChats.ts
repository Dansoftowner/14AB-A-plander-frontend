import { useInfiniteQuery } from '@tanstack/react-query'
import apiClient from '../services/apiClient'
import i18n from '../i18n'

export const useChats = (limit: number) =>
  useInfiniteQuery({
    queryKey: ['chats'],
    queryFn: ({ pageParam = 1 }) =>
      apiClient
        .get('/chats', {
          params: {
            offset: (pageParam - 1) * limit,
            limit: limit,
          },
          headers: {
            'x-plander-auth':
              localStorage.getItem('token') || sessionStorage.getItem('token'),
            'Accept-Language': i18n.language,
          },
        })
        .then((res) => res.data),
    staleTime: 1000 * 60,
    keepPreviousData: true,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.items.length > 0 ? allPages.length + 1 : undefined
    },
  })
