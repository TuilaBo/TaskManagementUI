import { useState } from 'react'
import { Link } from 'react-router-dom'
import { authApi } from '../../../api/authApi'
import { Button } from '../../../shared/components/Button'
import { Input } from '../../../shared/components/Input'
import {
  LockIcon,
  MailIcon,
  TaskIcon,
  UserIcon,
  UserCheckIcon,
} from '../../../shared/components/Icons'
import {
  validateRegisterForm,
  type RegisterFieldErrors,
} from '../utils/registerValidation'
import { VerifyForm } from '../components/VerifyForm'

export function RegisterPage() {
  const [step, setStep] = useState<'register' | 'verify'>('register')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [fieldErrors, setFieldErrors] = useState<RegisterFieldErrors>({})
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    const formData = { username, password, email, fullName }
    const errors = validateRegisterForm(formData)
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    setLoading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const { data } = await authApi.register(formData)
      if (data.status >= 400) throw new Error(data.message)

      setSuccessMessage(
        data.message ??
          'Đăng ký thành công. Vui lòng kiểm tra email để kích hoạt tài khoản.',
      )
      setStep('verify')
    } catch (err) {
      const axiosErr = err as {
        response?: { data?: { message?: string; data?: Record<string, string> } }
      }
      const validationData = axiosErr.response?.data?.data
      if (validationData) {
        setFieldErrors(validationData as RegisterFieldErrors)
      }
      setError(axiosErr.response?.data?.message ?? 'Đăng ký thất bại')
    } finally {
      setLoading(false)
    }
  }

  const clearFieldError = (field: keyof RegisterFieldErrors) => {
    setFieldErrors((prev) => {
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <TaskIcon size={28} />
          </div>
          <h1>{step === 'register' ? 'Tạo tài khoản Staff' : 'Kích hoạt tài khoản'}</h1>
          <p className="auth-subtitle">
            {step === 'register'
              ? 'Bước 1: Đăng ký thông tin — hệ thống sẽ gửi mã OTP qua email'
              : 'Bước 2: Nhập mã OTP từ email để kích hoạt tài khoản'}
          </p>
        </div>

        {step === 'register' ? (
          <form className="auth-form" onSubmit={handleRegister} noValidate>
            <Input
              label="Tên đăng nhập"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value)
                clearFieldError('username')
              }}
              error={fieldErrors.username}
              iconLeft={<UserIcon size={18} />}
              required
              minLength={6}
              autoComplete="username"
            />

            <Input
              label="Họ và tên"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value)
                clearFieldError('fullName')
              }}
              error={fieldErrors.fullName}
              iconLeft={<UserCheckIcon size={18} />}
              required
              minLength={9}
              autoComplete="name"
            />

            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                clearFieldError('email')
              }}
              error={fieldErrors.email}
              iconLeft={<MailIcon size={18} />}
              required
              autoComplete="email"
            />

            <Input
              label="Mật khẩu"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                clearFieldError('password')
              }}
              error={fieldErrors.password}
              iconLeft={<LockIcon size={18} />}
              required
              minLength={8}
              autoComplete="new-password"
            />

            {error && (
              <div className="alert alert-error" role="alert">
                {error}
              </div>
            )}

            <Button type="submit" loading={loading} block>
              Đăng ký
            </Button>

            <p className="auth-link">
              Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
            </p>
          </form>
        ) : (
          <>
            {successMessage && (
              <p className="success-hint">{successMessage}</p>
            )}
            <VerifyForm initialEmail={email} />
            <button
              type="button"
              className="auth-back-link"
              onClick={() => setStep('register')}
            >
              ← Quay lại đăng ký
            </button>
          </>
        )}
      </div>
    </div>
  )
}
