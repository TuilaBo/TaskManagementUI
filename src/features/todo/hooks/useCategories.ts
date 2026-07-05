import { useCallback, useEffect, useState } from 'react'
import type { AxiosError } from 'axios'
import { categoryApi } from '../api/categoryApi'
import type { TaskCategory } from '../types/category'

function getErrorMessage(error: unknown): string {
  const axiosError = error as AxiosError<{ message?: string }>
  return axiosError.response?.data?.message ?? 'Không thể tải danh mục'
}

export function useCategories(enabled = true) {
  const [categories, setCategories] = useState<TaskCategory[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = useCallback(async () => {
    if (!enabled) return
    setLoading(true)
    setError(null)
    try {
      const { data } = await categoryApi.getAll()
      if (data.status >= 400) throw new Error(data.message)
      setCategories(data.data ?? [])
    } catch (err) {
      setError(getErrorMessage(err))
      setCategories([])
    } finally {
      setLoading(false)
    }
  }, [enabled])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  return { categories, loading, error, refetch: fetchCategories }
}
