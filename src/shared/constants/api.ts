export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://techrent.website/api'

export const STORAGE_KEYS = {
  TOKEN: 'token',
  ROLE: 'role',
  USERNAME: 'username',
  FULL_NAME: 'fullName',
} as const
