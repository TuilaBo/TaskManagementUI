import { useState } from 'react'
import type { AxiosError } from 'axios'
import { todoApi } from '../api/todoApi'
import type { TaskRequest, TaskResponse } from '../types/todo'

function getErrorMessage(error: unknown): string {
  const axiosError = error as AxiosError<{ message?: string }>
  return axiosError.response?.data?.message ?? 'Không thể cập nhật task'
}

export function useUpdateTodo() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateTodo = async (
    id: number,
    data: TaskRequest,
  ): Promise<TaskResponse | null> => {
    setLoading(true)
    setError(null)
    try {
      const { data: response } = await todoApi.update(id, data)
      if (response.status >= 400) throw new Error(response.message)
      return response.data
    } catch (err) {
      setError(getErrorMessage(err))
      return null
    } finally {
      setLoading(false)
    }
  }

  const sendReminder = async (id: number): Promise<boolean> => {
    setLoading(true)
    setError(null)
    try {
      const { data: response } = await todoApi.sendReminder(id)
      if (response.status >= 400) throw new Error(response.message)
      return true
    } catch (err) {
      setError(getErrorMessage(err))
      return false
    } finally {
      setLoading(false)
    }
  }

  return { updateTodo, sendReminder, loading, error }
}
