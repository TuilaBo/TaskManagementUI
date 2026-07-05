import { apiClient } from './axios'
import type {
  ApiResponse,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  SendVerificationCodeRequest,
  VerifyRequest,
} from '../shared/types/api'

export const authApi = {
  register: (data: RegisterRequest) =>
    apiClient.post<ApiResponse<null>>('/api/auth/register', data),

  verify: (data: VerifyRequest) =>
    apiClient.post<ApiResponse<null>>('/api/auth/verify', data),

  sendVerificationCode: (data: SendVerificationCodeRequest) =>
    apiClient.post<ApiResponse<null>>('/api/auth/send-verification-code', data),

  login: (data: LoginRequest) =>
    apiClient.post<ApiResponse<AuthResponse>>('/api/auth/login', data),
}
