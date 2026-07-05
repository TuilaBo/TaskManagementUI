import { useState } from 'react'
import type { AxiosError } from 'axios'
import { todoApi } from '../api/todoApi'
import type { TaskRequest, TaskResponse } from '../types/todo'

function getErrorMessage(error: unknown): string {
  const axiosError = error as AxiosError<{ message?: string }>
  return axiosError.response?.data?.message ?? 'Không thể tạo task'
}

export function useCreateTodo() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createTodo = async (data: TaskRequest): Promise<TaskResponse | null> => {
    setLoading(true)
    setError(null)
    try {
      const { data: response } = await todoApi.create(data)
      if (response.status >= 400) throw new Error(response.message)
      return response.data
    } catch (err) {
      setError(getErrorMessage(err))
      return null
    } finally {
      setLoading(false)
    }
  }

  return { createTodo, loading, error }
}
