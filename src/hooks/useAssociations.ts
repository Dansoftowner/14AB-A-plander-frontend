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

const useAssociations = () =>
  useData<Association>('/associations', {
    params: {
      offset: 0,
      limit: 5,
      projection: 'lite',
      orderBy: 'name',
    },
  })
console.log()

export default useAssociations
