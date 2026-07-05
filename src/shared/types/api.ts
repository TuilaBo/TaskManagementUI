export interface ApiResponse<T> {
  message: string
  status: number
  data: T | null
}

export type Role = 'MANAGER' | 'STAFF'

export interface AuthResponse {
  token: string
  username: string
  role: Role
}

export interface LoginRequest {
  username: string
  password: string
}

export interface SendVerificationCodeRequest {
  email: string
}

export interface UserResponse {
  id: number
  username: string
  fullName: string
  email: string
  role: Role
  active: boolean
}

export interface RegisterRequest {
  username: string
  password: string
  email: string
  fullName: string
}

export interface VerifyRequest {
  email: string
  verificationCode: string
}

export interface UpdateProfileRequest {
  fullName?: string
  email?: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}
