import axios from 'axios'
import { useInfiniteQuery } from '@tanstack/react-query'

export interface Association {
  _id: string
  name: string
  location: string
  certificate: string
}
export interface AsQuery {
  offset?: number
  limit: number
  projection?: string
  orderBy?: string
  q?: string
}
interface Response {
  metadata: { offset?: number; limit?: number; total?: number }
  items: Association[]
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

export const useAssociations = (query: AsQuery) =>
  useInfiniteQuery<Response>({
    queryKey: ['associations', query],
    queryFn: ({ pageParam = 1 }) =>
      axios
        .get<Response>('https://plander-dev.onrender.com/api/associations', {
          params: {
            offset: (pageParam - 1) * query.limit,
            limit: query.limit,
            projection: query.projection,
            q: query.q,
          },
        })
        .then((res) => res.data),
    staleTime: 1000 * 60,
    keepPreviousData: true,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.items.length > 0 ? allPages.length + 1 : undefined
    },
  })
