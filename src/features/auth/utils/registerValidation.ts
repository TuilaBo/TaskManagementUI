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
  } else if (data.username.length < 3 || data.username.length > 50) {
    errors.username = 'Username must be between 3 and 50 characters'
  }

  if (!data.fullName.trim()) {
    errors.fullName = 'Full name is required'
  }

  if (!data.password) {
    errors.password = 'Password is required'
  } else if (data.password.length < 6) {
    errors.password = 'Password must be at least 6 characters'
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
