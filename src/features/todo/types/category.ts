export interface TaskCategory {
  id: number
  name: string
  description: string
}

export interface TaskCategoryRequest {
  name: string
  description?: string
}
