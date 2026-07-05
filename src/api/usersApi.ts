import { apiClient } from './axios'
import type {
  ApiResponse,
  UserResponse,
  UpdateProfileRequest,
  ChangePasswordRequest,
} from '../shared/types/api'

export const usersApi = {
  getActiveStaff: () =>
    apiClient.get<ApiResponse<UserResponse[]>>('/api/users', {
      params: { role: 'STAFF', active: true },
    }),

  getProfile: () =>
    apiClient.get<ApiResponse<UserResponse>>('/api/users/me'),

  updateProfile: (data: UpdateProfileRequest) =>
    apiClient.put<ApiResponse<UserResponse>>('/api/users/me', data),

  changePassword: (data: ChangePasswordRequest) =>
    apiClient.put<ApiResponse<null>>('/api/users/me/change-password', data),
}
