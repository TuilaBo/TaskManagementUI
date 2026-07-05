import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '../../../api/authApi'
import { usersApi } from '../../../api/usersApi'
import { Button } from '../../../shared/components/Button'
import { Input } from '../../../shared/components/Input'
import { LockIcon, TaskIcon, UserIcon } from '../../../shared/components/Icons'
import { STORAGE_KEYS } from '../../../shared/constants/api'

export function LoginPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [notActivated, setNotActivated] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setNotActivated(false)

    try {
      const { data } = await authApi.login({ username, password })
      if (data.status >= 400 || !data.data) throw new Error(data.message)

      localStorage.setItem(STORAGE_KEYS.TOKEN, data.data.token)
      localStorage.setItem(STORAGE_KEYS.ROLE, data.data.role)
      localStorage.setItem(STORAGE_KEYS.USERNAME, data.data.username)

      // Get profile to save fullName
      try {
        const { data: profileData } = await usersApi.getProfile()
        if (profileData.data?.fullName) {
          localStorage.setItem(STORAGE_KEYS.FULL_NAME, profileData.data.fullName)
        }
      } catch {
        // Ignore profile fetch error
      }

      navigate('/tasks')
    } catch (err) {
      const axiosErr = err as {
        response?: {
          status?: number
          data?: { message?: string; status?: number }
        }
      }
      const status = axiosErr.response?.data?.status ?? axiosErr.response?.status
      const message =
        axiosErr.response?.data?.message ?? 'Đăng nhập thất bại'

      if (status === 403) {
        setNotActivated(true)
      }
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const verifyLink = username.includes('@')
    ? `/verify?email=${encodeURIComponent(username)}`
    : '/verify'

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <TaskIcon size={28} />
          </div>
          <h1>Chào mừng trở lại</h1>
          <p className="auth-subtitle">
            Đăng nhập bằng tên đăng nhập hoặc email
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <Input
            label="Tên đăng nhập hoặc Email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            iconLeft={<UserIcon size={18} />}
            required
            autoComplete="username"
            placeholder="username hoặc email@example.com"
          />
          <Input
            label="Mật khẩu"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            iconLeft={<LockIcon size={18} />}
            required
            autoComplete="current-password"
          />

          {error && (
            <div className="alert alert-error" role="alert">
              {error}
              {notActivated && (
                <p className="auth-verify-prompt">
                  <Link to={verifyLink}>Kích hoạt tài khoản ngay →</Link>
                </p>
              )}
            </div>
          )}

          <Button type="submit" loading={loading} block>
            Đăng nhập
          </Button>

          <p className="auth-link">
            Chưa có tài khoản? <Link to="/register">Đăng ký Staff</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
