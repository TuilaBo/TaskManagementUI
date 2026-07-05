import { apiClient } from '../../../api/axios'
import type { ApiResponse } from '../../../shared/types/api'
import type {
  CompleteTaskPayload,
  PageResponse,
  TaskFilters,
  TaskRequest,
  TaskResponse,
} from '../types/todo'

function buildQuery(filters?: TaskFilters) {
  const params = new URLSearchParams()
  if (filters?.status) params.set('status', filters.status)
  if (filters?.keyword) params.set('keyword', filters.keyword)
  if (filters?.page !== undefined) params.set('page', String(filters.page))
  if (filters?.size !== undefined) params.set('size', String(filters.size))
  if (filters?.sortBy) params.set('sortBy', filters.sortBy)
  if (filters?.sortDir) params.set('sortDir', filters.sortDir)
  const qs = params.toString()
  return qs ? `?${qs}` : ''
}

export const todoApi = {
  getAll: (filters?: TaskFilters) =>
    apiClient.get<ApiResponse<PageResponse<TaskResponse>>>(`/api/tasks${buildQuery(filters)}`),

  getById: (id: number) =>
    apiClient.get<ApiResponse<TaskResponse>>(`/api/tasks/${id}`),

  create: (data: TaskRequest) =>
    apiClient.post<ApiResponse<TaskResponse>>('/api/tasks', data),

  update: (id: number, data: TaskRequest) =>
    apiClient.put<ApiResponse<TaskResponse>>(`/api/tasks/${id}`, data),

  delete: (id: number) =>
    apiClient.delete<ApiResponse<null>>(`/api/tasks/${id}`),

  complete: (id: number, payload: CompleteTaskPayload) => {
    const formData = new FormData()
    if (payload.note?.trim()) formData.append('note', payload.note.trim())
    if (payload.image) formData.append('image', payload.image)
    return apiClient.post<ApiResponse<TaskResponse>>(
      `/api/tasks/${id}/complete`,
      formData,
    )
  },

  sendReminder: (id: number) =>
    apiClient.post<ApiResponse<null>>(`/api/tasks/${id}/remind`),
}
