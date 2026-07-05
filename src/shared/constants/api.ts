export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://160.22.107.121:8081'

export const STORAGE_KEYS = {
  TOKEN: 'token',
  ROLE: 'role',
  USERNAME: 'username',
  FULL_NAME: 'fullName',
} as const
