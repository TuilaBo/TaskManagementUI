import { useState } from 'react'
import type { AxiosError } from 'axios'
import { todoApi } from '../api/todoApi'

function getErrorMessage(error: unknown): string {
  const axiosError = error as AxiosError<{ message?: string }>
  return axiosError.response?.data?.message ?? 'Không thể xóa task'
}

export function useDeleteTodo() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deleteTodo = async (id: number): Promise<boolean> => {
    setLoading(true)
    setError(null)
    try {
      const { data: response } = await todoApi.delete(id)
      if (response.status >= 400) throw new Error(response.message)
      return true
    } catch (err) {
      setError(getErrorMessage(err))
      return false
    } finally {
      setLoading(false)
    }
  }

  return { deleteTodo, loading, error }
}
