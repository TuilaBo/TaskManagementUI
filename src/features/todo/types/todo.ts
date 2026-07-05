export type TaskStatus = 'PENDING' | 'COMPLETED'

export interface TaskRequest {
  title?: string
  description?: string
  assignedToId?: number
  categoryId?: number
  startDate?: string
  deadline?: string
}

export interface TaskResponse {
  id: number
  title: string
  description: string
  status: TaskStatus
  assignedToId: number
  assignedToUsername: string
  createdById: number
  createdByUsername: string
  createdAt: string
  updatedAt: string
  categoryId: number | null
  categoryName: string | null
  startDate: string | null
  deadline: string | null
  completionNote: string | null
  proofImageUrl: string | null
  completedAt: string | null
}

export interface TaskFilters {
  status?: TaskStatus
  keyword?: string
  assignedToId?: number
  page?: number
  size?: number
  sortBy?: 'createdAt' | 'updatedAt' | 'deadline' | 'title' | 'startDate'
  sortDir?: 'asc' | 'desc'
}

export interface PageResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  first: boolean
  last: boolean
}

export interface CompleteTaskPayload {
  note?: string
  image?: File
}

export const ALLOWED_PROOF_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
] as const

export const MAX_PROOF_SIZE_BYTES = 5 * 1024 * 1024
