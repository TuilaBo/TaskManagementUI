import { apiClient } from './axios'
import type {
  ApiResponse,
  UserResponse,
  UpdateProfileRequest,
  ChangePasswordRequest,
} from '../shared/types/api'

export const usersApi = {
  getActiveStaff: () =>
    apiClient.get<ApiResponse<UserResponse[]>>('/users', {
      params: { role: 'STAFF', active: true },
    }),

  getProfile: () =>
    apiClient.get<ApiResponse<UserResponse>>('/users/me'),

  updateProfile: (data: UpdateProfileRequest) =>
    apiClient.put<ApiResponse<UserResponse>>('/users/me', data),

  changePassword: (data: ChangePasswordRequest) =>
    apiClient.put<ApiResponse<null>>('/users/me/change-password', data),
}
