import type { TaskStatus } from './types/todo'

export const TASK_STATUS = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
} as const satisfies Record<string, TaskStatus>

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  PENDING: 'Chưa hoàn thành',
  COMPLETED: 'Đã hoàn thành',
}

export const FILTER_OPTIONS = [
  { value: '', label: 'Tất cả' },
  { value: TASK_STATUS.PENDING, label: TASK_STATUS_LABELS.PENDING },
  { value: TASK_STATUS.COMPLETED, label: TASK_STATUS_LABELS.COMPLETED },
] as const
