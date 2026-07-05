import { apiClient } from '../../../api/axios'
import type { ApiResponse } from '../../../shared/types/api'
import type { TaskCategory, TaskCategoryRequest } from '../types/category'

export const categoryApi = {
  getAll: () =>
    apiClient.get<ApiResponse<TaskCategory[]>>('/api/task-categories'),

  getById: (id: number) =>
    apiClient.get<ApiResponse<TaskCategory>>(`/api/task-categories/${id}`),

  create: (data: TaskCategoryRequest) =>
    apiClient.post<ApiResponse<TaskCategory>>('/api/task-categories', data),

  update: (id: number, data: TaskCategoryRequest) =>
    apiClient.put<ApiResponse<TaskCategory>>(`/api/task-categories/${id}`, data),

  delete: (id: number) =>
    apiClient.delete<ApiResponse<null>>(`/api/task-categories/${id}`),
}
