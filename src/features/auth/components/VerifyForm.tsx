import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { authApi } from '../../../api/authApi'
import { Button } from '../../../shared/components/Button'
import { Input } from '../../../shared/components/Input'
import { KeyIcon, MailIcon, TaskIcon } from '../../../shared/components/Icons'
import {
  validateEmail,
  validateVerifyForm,
  type VerifyFieldErrors,
} from '../utils/registerValidation'

interface VerifyFormProps {
  initialEmail?: string
}

export function VerifyForm({ initialEmail = '' }: VerifyFormProps) {
  const navigate = useNavigate()
  const [email, setEmail] = useState(initialEmail)
  const [verificationCode, setVerificationCode] = useState('')
  const [fieldErrors, setFieldErrors] = useState<VerifyFieldErrors>({})
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [sendingCode, setSendingCode] = useState(false)

  const handleResendCode = async () => {
    const emailError = validateEmail(email)
    setFieldErrors((prev) => ({ ...prev, email: emailError }))
    if (emailError) return

    setSendingCode(true)
    setError(null)

    try {
      const { data } = await authApi.sendVerificationCode({ email })
      if (data.status >= 400) throw new Error(data.message)
      setSuccessMessage('Mã kích hoạt mới đã được gửi tới email (hiệu lực 10 phút).')
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message ?? 'Không thể gửi lại mã'
      setError(message)
    } finally {
      setSendingCode(false)
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()

    const formData = { email, verificationCode }
    const errors = validateVerifyForm(formData)
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    setLoading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const { data } = await authApi.verify(formData)
      if (data.status >= 400) throw new Error(data.message)

      setSuccessMessage(data.message ?? 'Kích hoạt thành công. Bạn có thể đăng nhập.')
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      const axiosErr = err as {
        response?: { data?: { message?: string; data?: Record<string, string> } }
      }
      const validationData = axiosErr.response?.data?.data
      if (validationData) {
        setFieldErrors(validationData as VerifyFieldErrors)
      }
      setError(axiosErr.response?.data?.message ?? 'Kích hoạt thất bại')
    } finally {
      setLoading(false)
    }
  }

  const clearFieldError = (field: keyof VerifyFieldErrors) => {
    setFieldErrors((prev) => {
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  return (
    <form className="auth-form" onSubmit={handleVerify} noValidate>
      <div className="email-code-row">
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
        <Button
          type="button"
          variant="secondary"
          size="sm"
          loading={sendingCode}
          onClick={handleResendCode}
        >
          Gửi lại mã
        </Button>
      </div>

      <Input
        label="Mã kích hoạt (OTP)"
        value={verificationCode}
        onChange={(e) => {
          const value = e.target.value.replace(/\D/g, '').slice(0, 6)
          setVerificationCode(value)
          clearFieldError('verificationCode')
        }}
        error={fieldErrors.verificationCode}
        iconLeft={<KeyIcon size={18} />}
        required
        inputMode="numeric"
        pattern="\d{6}"
        minLength={6}
        maxLength={6}
        placeholder="6 chữ số"
      />

      {successMessage && (
        <p className="success-hint">{successMessage}</p>
      )}

      {error && (
        <div className="alert alert-error" role="alert">
          {error}
        </div>
      )}

      <Button type="submit" loading={loading} block>
        Kích hoạt tài khoản
      </Button>
    </form>
  )
}

export function VerifyPage() {
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email') ?? ''

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <TaskIcon size={28} />
          </div>
          <h1>Kích hoạt tài khoản</h1>
          <p className="auth-subtitle">
            Nhập mã OTP từ email để kích hoạt tài khoản Staff
          </p>
        </div>

        <VerifyForm initialEmail={email} />

        <p className="auth-link">
          Đã kích hoạt? <Link to="/login">Đăng nhập</Link>
        </p>
      </div>
    </div>
  )
}
