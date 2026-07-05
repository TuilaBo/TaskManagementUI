import { useEffect, useState } from 'react'
import { Button } from '../../../shared/components/Button'
import { Input } from '../../../shared/components/Input'
import {
  LockIcon,
  MailIcon,
  UserCheckIcon,
} from '../../../shared/components/Icons'
import { usersApi } from '../../../api/usersApi'
import type { UserResponse } from '../../../shared/types/api'
import { STORAGE_KEYS } from '../../../shared/constants/api'

export function ProfilePage() {
  const [profile, setProfile] = useState<UserResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [profileSuccess, setProfileSuccess] = useState(false)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = useState(false)

  useEffect(() => {
    loadProfile()
  }, [])

  async function loadProfile() {
    setLoading(true)
    setError(null)
    try {
      const { data } = await usersApi.getProfile()
      if (data.data) {
        setProfile(data.data)
        setFullName(data.data.fullName || '')
        setEmail(data.data.email)
      }
    } catch (err) {
      const axiosErr = err as { response?: { data?: { message?: string } } }
      setError(axiosErr.response?.data?.message ?? 'Không thể tải thông tin')
    } finally {
      setLoading(false)
    }
  }

  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault()
    setProfileLoading(true)
    setProfileError(null)
    setProfileSuccess(false)

    try {
      const { data } = await usersApi.updateProfile({ fullName, email })
      if (data.data) {
        setProfile(data.data)
        localStorage.setItem(STORAGE_KEYS.FULL_NAME, fullName)
        setProfileSuccess(true)
        setTimeout(() => setProfileSuccess(false), 3000)
      }
    } catch (err) {
      const axiosErr = err as { response?: { data?: { message?: string } } }
      setProfileError(axiosErr.response?.data?.message ?? 'Cập nhật thất bại')
    } finally {
      setProfileLoading(false)
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    setPasswordLoading(true)
    setPasswordError(null)
    setPasswordSuccess(false)

    if (newPassword.length < 6) {
      setPasswordError('Mật khẩu mới phải có ít nhất 6 ký tự')
      setPasswordLoading(false)
      return
    }

    try {
      await usersApi.changePassword({
        currentPassword,
        newPassword,
      })
      setCurrentPassword('')
      setNewPassword('')
      setPasswordSuccess(true)
      setTimeout(() => setPasswordSuccess(false), 3000)
    } catch (err) {
      const axiosErr = err as { response?: { data?: { message?: string } } }
      setPasswordError(axiosErr.response?.data?.message ?? 'Đổi mật khẩu thất bại')
    } finally {
      setPasswordLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="profile-page">
        <div className="loading">
          <div className="loading-spinner" />
          <p>Đang tải thông tin...</p>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="profile-page">
        <div className="page-header">
          <h1>Hồ sơ cá nhân</h1>
        </div>
        <div className="alert alert-error">{error ?? 'Không thể tải thông tin'}</div>
      </div>
    )
  }

  return (
    <div className="profile-page">
      <div className="page-header">
        <h1>Hồ sơ cá nhân</h1>
      </div>

      <div className="profile-card">
        <div className="profile-avatar-section">
          <div className="profile-avatar">
            {(fullName || profile.username).split(' ').map((n) => n[0] || '').join('').slice(0, 2).toUpperCase() || profile.username.slice(0, 2).toUpperCase()}
          </div>
          <div className="profile-info-summary">
            <h2>{(profile.fullName || profile.username)}</h2>
            <span className="profile-role">{profile.role === 'MANAGER' ? 'Quản lý' : 'Nhân viên'}</span>
          </div>
        </div>

        <form className="profile-form" onSubmit={handleUpdateProfile}>
          <h3>Thông tin cá nhân</h3>

          <div className="field">
            <label className="field-label">Tên đăng nhập</label>
            <Input value={profile.username} disabled iconLeft={<UserCheckIcon size={18} />} />
          </div>

          <Input
            label="Họ và tên"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            iconLeft={<UserCheckIcon size={18} />}
          />

          <Input
            label="Email"
            type="email"
            value={email}
            iconLeft={<MailIcon size={18} />}
            disabled
          />

          {profileError && <div className="alert alert-error">{profileError}</div>}
          {profileSuccess && <div className="alert alert-success">Cập nhật thành công!</div>}

          <Button type="submit" loading={profileLoading}>
            Lưu thay đổi
          </Button>
        </form>

        <form className="profile-form" onSubmit={handleChangePassword}>
          <h3>Đổi mật khẩu</h3>

          <Input
            label="Mật khẩu hiện tại"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            iconLeft={<LockIcon size={18} />}
            required
          />

          <Input
            label="Mật khẩu mới"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            iconLeft={<LockIcon size={18} />}
            required
            minLength={6}
          />
          {newPassword.length > 0 && newPassword.length < 6 && (
            <span className="field-hint">Mật khẩu phải có ít nhất 6 ký tự</span>
          )}

          {passwordError && <div className="alert alert-error">{passwordError}</div>}
          {passwordSuccess && <div className="alert alert-success">Đổi mật khẩu thành công!</div>}

          <Button type="submit" variant="secondary" loading={passwordLoading}>
            Đổi mật khẩu
          </Button>
        </form>
      </div>
    </div>
  )
}
