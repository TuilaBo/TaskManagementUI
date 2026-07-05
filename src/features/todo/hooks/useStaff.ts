import { useEffect, useState } from 'react'
import type { AxiosError } from 'axios'
import { usersApi } from '../../../api/usersApi'
import type { UserResponse } from '../../../shared/types/api'

function getErrorMessage(error: unknown): string {
  const axiosError = error as AxiosError<{ message?: string }>
  return axiosError.response?.data?.message ?? 'Không thể tải danh sách nhân viên'
}

export function useStaff(enabled: boolean) {
  const [staff, setStaff] = useState<UserResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!enabled) return

    let cancelled = false

    async function fetchStaff() {
      setLoading(true)
      setError(null)
      try {
        const { data } = await usersApi.getActiveStaff()
        if (data.status >= 400) throw new Error(data.message)
        if (!cancelled) setStaff(data.data ?? [])
      } catch (err) {
        if (!cancelled) {
          setError(getErrorMessage(err))
          setStaff([])
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchStaff()
    return () => {
      cancelled = true
    }
  }, [enabled])

  return { staff, loading, error }
}
