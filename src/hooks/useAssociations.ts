import useData from './useData'

interface Association {
  _id: string
  name: string
  location: string
  certifacete: string
}
export interface AsQuery {
  offset?: number
  limit?: number
  projection?: string
  orderBy?: string
  q?: string
}

const useAssociations = (asq: AsQuery) =>
  useData<Association>('/associations', {
    params: {
      offset: asq.offset,
      limit: asq.limit,
      projection: asq.projection,
      orderBy: asq.orderBy,
    },
  })

export default useAssociations
