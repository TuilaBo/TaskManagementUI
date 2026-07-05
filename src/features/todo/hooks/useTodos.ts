import { useCallback, useEffect, useState } from 'react'
import type { AxiosError } from 'axios'
import { todoApi } from '../api/todoApi'
import type { TaskFilters, TaskResponse } from '../types/todo'

function getErrorMessage(error: unknown): string {
  const axiosError = error as AxiosError<{ message?: string }>
  return axiosError.response?.data?.message ?? 'Không thể tải danh sách task'
}

export interface PaginationInfo {
  page: number
  size: number
  totalElements: number
  totalPages: number
  first: boolean
  last: boolean
}

export function useTodos(filters?: TaskFilters) {
  const [todos, setTodos] = useState<TaskResponse[]>([])
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 0,
    size: 5,
    totalElements: 0,
    totalPages: 0,
    first: true,
    last: true,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTodos = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await todoApi.getAll(filters)
      if (data.status >= 400) throw new Error(data.message)
      const pageData = data.data
      setTodos(pageData?.content ?? [])
      if (pageData) {
        const { content: _, ...paginationData } = pageData
        setPagination(paginationData)
      }
    } catch (err) {
      setError(getErrorMessage(err))
      setTodos([])
    } finally {
      setLoading(false)
    }
  }, [filters?.status, filters?.keyword, filters?.assignedToId, filters?.page, filters?.size, filters?.sortBy, filters?.sortDir])

  useEffect(() => {
    fetchTodos()
  }, [fetchTodos])

  return { todos, loading, error, refetch: fetchTodos, pagination }
}
