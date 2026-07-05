import { useState } from 'react'
import type { AxiosError } from 'axios'
import { todoApi } from '../api/todoApi'
import type { CompleteTaskPayload, TaskResponse } from '../types/todo'

function getErrorMessage(error: unknown): string {
  const axiosError = error as AxiosError<{ message?: string }>
  return axiosError.response?.data?.message ?? 'Không thể hoàn thành task'
}

export function useCompleteTodo() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const completeTodo = async (
    id: number,
    payload: CompleteTaskPayload,
  ): Promise<TaskResponse | null> => {
    setLoading(true)
    setError(null)
    try {
      const { data: response } = await todoApi.complete(id, payload)
      if (response.status >= 400) throw new Error(response.message)
      return response.data
    } catch (err) {
      setError(getErrorMessage(err))
      return null
    } finally {
      setLoading(false)
    }
  }

  return { completeTodo, loading, error }
}
