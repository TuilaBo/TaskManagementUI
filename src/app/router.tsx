import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { LoginPage } from '../features/auth/pages/LoginPage'
import { RegisterPage } from '../features/auth/pages/RegisterPage'
import { VerifyPage } from '../features/auth/components/VerifyForm'
import { TodoPage } from '../features/todo/pages/TodoPage'
import { CategoryPage } from '../features/todo/pages/CategoryPage'
import { ProfilePage } from '../features/profile/pages/ProfilePage'
import { GuestRoute, ProtectedRoute } from '../layouts/ProtectedRoute'
import { MainLayout } from '../layouts/MainLayout'

export function AppRouter() {
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify" element={<VerifyPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/tasks" element={<TodoPage />} />
          <Route path="/categories" element={<CategoryPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/tasks" replace />} />
    </Routes>
  )
}

export function RouterProvider({ children }: { children: React.ReactNode }) {
  return <BrowserRouter>{children}</BrowserRouter>
}
