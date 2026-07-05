export interface RegisterFormData {
  username: string
  password: string
  email: string
  fullName: string
}

export interface VerifyFormData {
  email: string
  verificationCode: string
}

export type RegisterFieldErrors = Partial<Record<keyof RegisterFormData, string>>
export type VerifyFieldErrors = Partial<Record<keyof VerifyFormData, string>>

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateEmail(email: string): string | undefined {
  if (!email.trim()) return 'Email is required'
  if (!EMAIL_REGEX.test(email)) return 'Email must be valid'
  return undefined
}

export function validateRegisterForm(data: RegisterFormData): RegisterFieldErrors {
  const errors: RegisterFieldErrors = {}

  if (!data.username.trim()) {
    errors.username = 'Username is required'
  } else if (data.username.length < 6) {
    errors.username = 'Username phải có ít nhất 6 ký tự'
  }

  if (!data.fullName.trim()) {
    errors.fullName = 'Họ và tên is required'
  } else if (data.fullName.trim().length < 9) {
    errors.fullName = 'Họ và tên phải có ít nhất 9 ký tự'
  }

  if (!data.password) {
    errors.password = 'Password is required'
  } else if (data.password.length < 8) {
    errors.password = 'Mật khẩu phải có ít nhất 8 ký tự'
  } else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(data.password)) {
    errors.password = 'Mật khẩu phải bao gồm chữ và số'
  }

  const emailError = validateEmail(data.email)
  if (emailError) errors.email = emailError

  return errors
}

export function validateVerifyForm(data: VerifyFormData): VerifyFieldErrors {
  const errors: VerifyFieldErrors = {}

  const emailError = validateEmail(data.email)
  if (emailError) errors.email = emailError

  if (!data.verificationCode.trim()) {
    errors.verificationCode = 'Verification code is required'
  } else if (!/^\d{6}$/.test(data.verificationCode)) {
    errors.verificationCode = 'Verification code must be 6 digits'
  }

  return errors
}
