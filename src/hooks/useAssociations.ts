import axios from 'axios'
import apiClient from '../services/apiClient'
import useData from './useData'
import { useInfiniteQuery } from '@tanstack/react-query'

export interface Association {
  _id: string
  name: string
  location: string
  certificate: string
}
export interface AsQuery {
  offset?: number
  limit?: number
  projection?: string
  orderBy?: string
  q?: string
}

// const useAssociations = (asq: AsQuery) =>
//   useData<Association>('/associations', {
//     params: {
//       offset: asq.offset,
//       limit: asq.limit,
//       projection: asq.projection,
//       orderBy: asq.orderBy,
//     },
//   })

const useAssociations = (query: AsQuery) =>
  useInfiniteQuery<Association[], Error>({
    queryKey: ['associations', query],
    queryFn: ({ pageParam = 1 }) =>
      axios
        .get<Association[]>('/associations', {
          params: {
            offset: pageParam,
            limit: 10,
          },
        })
        .then((res) => res.data),
    staleTime: 1000 * 60,
    keepPreviousData: true,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length > 0 ? allPages.length : undefined
    },
  })

export default useAssociations
