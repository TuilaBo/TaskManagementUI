import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  FilterIcon,
  LayoutDashboardIcon,
  LogoutIcon,
  MenuIcon,
  SettingsIcon,
  TaskIcon,
} from '../shared/components/Icons'
import { clearAuthSession } from '../api/interceptors'
import { STORAGE_KEYS } from '../shared/constants/api'

export function MainLayout() {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const username = localStorage.getItem(STORAGE_KEYS.USERNAME) ?? 'User'
  const role = localStorage.getItem(STORAGE_KEYS.ROLE) ?? 'STAFF'
  const fullName = localStorage.getItem(STORAGE_KEYS.FULL_NAME) || username
  const initials = fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || username.slice(0, 2).toUpperCase()

  const handleLogout = () => {
    clearAuthSession()
    navigate('/login')
  }

  const closeSidebar = () => setSidebarOpen(false)

  return (
    <div className="dashboard">
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'visible' : ''}`}
        onClick={closeSidebar}
        role="presentation"
      />

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">
            <TaskIcon size={22} />
          </div>
          <div className="sidebar-brand-text">
            Task<span>Flow</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <NavLink
            to="/tasks"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
            onClick={closeSidebar}
          >
            <span className="sidebar-link-icon">
              <LayoutDashboardIcon size={18} />
            </span>
            Quản lý Task
          </NavLink>
          <NavLink
            to="/categories"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
            onClick={closeSidebar}
          >
            <span className="sidebar-link-icon">
              <FilterIcon size={18} />
            </span>
            Danh mục
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
            onClick={closeSidebar}
          >
            <span className="sidebar-link-icon">
              <SettingsIcon size={18} />
            </span>
            Hồ sơ cá nhân
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-user-avatar">{initials}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{username}</div>
              <div className="sidebar-user-role">{role}</div>
            </div>
          </div>
          <button type="button" className="sidebar-link" onClick={handleLogout}>
            <span className="sidebar-link-icon">
              <LogoutIcon size={18} />
            </span>
            Đăng xuất
          </button>
        </div>
      </aside>

      <div className="dashboard-main">
        <header className="mobile-header">
          <div className="mobile-header-brand">
            <TaskIcon size={20} />
            TaskFlow
          </div>
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setSidebarOpen(true)}
            aria-label="Mở menu"
          >
            <MenuIcon size={20} />
          </button>
        </header>

        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
