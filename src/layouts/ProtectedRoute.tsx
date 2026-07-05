import { Navigate, Outlet } from 'react-router-dom'
import { STORAGE_KEYS } from '../shared/constants/api'

export function ProtectedRoute() {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
  if (!token) return <Navigate to="/login" replace />
  return <Outlet />
}

export function GuestRoute() {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
  if (token) return <Navigate to="/tasks" replace />
  return <Outlet />
}
