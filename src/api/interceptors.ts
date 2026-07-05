import type { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { apiClient } from './axios'
import { STORAGE_KEYS } from '../shared/constants/api'

let unauthorizedHandler: (() => void) | null = null
let interceptorsReady = false

function getStoredToken(): string | null {
  const raw = localStorage.getItem(STORAGE_KEYS.TOKEN)
  if (!raw) return null
  const token = raw.replace(/^Bearer\s+/i, '').trim()
  return token || null
}

function isAuthRequest(url?: string) {
  return !!url?.startsWith('/api/auth')
}

export function setUnauthorizedHandler(handler: () => void) {
  unauthorizedHandler = handler
}

export function clearAuthSession() {
  localStorage.removeItem(STORAGE_KEYS.TOKEN)
  localStorage.removeItem(STORAGE_KEYS.ROLE)
  localStorage.removeItem(STORAGE_KEYS.USERNAME)
}

export function setupInterceptors() {
  if (interceptorsReady) return
  interceptorsReady = true

  apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type']
    }

    if (isAuthRequest(config.url)) return config

    const token = getStoredToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  apiClient.interceptors.response.use(
    (response) => {
      const url = response.config.url
      if (!isAuthRequest(url) && response.data?.status === 401) {
        const hadAuth = !!response.config.headers?.Authorization
        if (hadAuth) {
          clearAuthSession()
          unauthorizedHandler?.()
        }
      }
      return response
    },
    (error: AxiosError<{ message?: string; status?: number }>) => {
      const config = error.config
      const httpStatus = error.response?.status
      const bodyStatus = error.response?.data?.status
      const isUnauthorized = httpStatus === 401 || bodyStatus === 401

      if (!isUnauthorized || isAuthRequest(config?.url)) {
        return Promise.reject(error)
      }

      const hadAuthHeader = !!config?.headers?.Authorization

      if (hadAuthHeader) {
        clearAuthSession()
        unauthorizedHandler?.()
      }

      return Promise.reject(error)
    },
  )
}
