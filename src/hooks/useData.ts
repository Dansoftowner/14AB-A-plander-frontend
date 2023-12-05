import { useState, useEffect } from 'react'
import { AxiosRequestConfig } from 'axios'
import apiClient from '../services/apiClient'

interface FetchResponse<T> {
  count: number
  items: T[]
}

const useData = <T>(
  endpoint: string,
  requestConfig?: AxiosRequestConfig,
  deps?: any[],
) => {
  const [data, setData] = useState<T[]>([])
  const [error, setError] = useState('')
  const [isLoading, setLoading] = useState(false)

  useEffect(
    () => {
      const controller = new AbortController()
      setLoading(true)

      apiClient
        .get<FetchResponse<T>>(endpoint, {
          signal: controller.signal,
          ...requestConfig,
        })
        .then((res) => {
          setData(res.data.items)
          setLoading(false)
        })
        .catch((err) => {
          if (err instanceof AbortSignal) return
          setError(err.message)
          setLoading(false)
        })
      return () => controller.abort()
    },
    deps ? [deps] : [],
  )

  return { data, error, isLoading }
}
export default useData
