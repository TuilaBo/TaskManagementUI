import { useState } from 'react'
import type { AxiosError } from 'axios'
import { categoryApi } from '../api/categoryApi'
import type { TaskCategory, TaskCategoryRequest } from '../types/category'

function getErrorMessage(error: unknown, fallback: string): string {
  const axiosError = error as AxiosError<{ message?: string }>
  return axiosError.response?.data?.message ?? fallback
}

export function useCategoryMutations() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createCategory = async (
    data: TaskCategoryRequest,
  ): Promise<TaskCategory | null> => {
    setLoading(true)
    setError(null)
    try {
      const { data: response } = await categoryApi.create(data)
      if (response.status >= 400) throw new Error(response.message)
      return response.data
    } catch (err) {
      setError(getErrorMessage(err, 'Không thể tạo danh mục'))
      return null
    } finally {
      setLoading(false)
    }
  }

  const updateCategory = async (
    id: number,
    data: TaskCategoryRequest,
  ): Promise<TaskCategory | null> => {
    setLoading(true)
    setError(null)
    try {
      const { data: response } = await categoryApi.update(id, data)
      if (response.status >= 400) throw new Error(response.message)
      return response.data
    } catch (err) {
      setError(getErrorMessage(err, 'Không thể cập nhật danh mục'))
      return null
    } finally {
      setLoading(false)
    }
  }

  const deleteCategory = async (id: number): Promise<boolean> => {
    setLoading(true)
    setError(null)
    try {
      const { data: response } = await categoryApi.delete(id)
      if (response.status >= 400) throw new Error(response.message)
      return true
    } catch (err) {
      setError(getErrorMessage(err, 'Không thể xóa danh mục'))
      return false
    } finally {
      setLoading(false)
    }
  }

  return { createCategory, updateCategory, deleteCategory, loading, error }
}
