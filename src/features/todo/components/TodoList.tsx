import { Loading } from '../../../shared/components/Loading'
import { ClipboardIcon } from '../../../shared/components/Icons'
import type { TaskResponse } from '../types/todo'
import { TodoItem } from './TodoItem'

interface TodoListProps {
  todos: TaskResponse[]
  loading: boolean
  error: string | null
  isManager: boolean
  onComplete: (todo: TaskResponse) => void
  onEdit: (todo: TaskResponse) => void
  onDelete: (id: number) => void
  onRemind: (todo: TaskResponse) => void
}

export function TodoList({
  todos,
  loading,
  error,
  isManager,
  onComplete,
  onEdit,
  onDelete,
  onRemind,
}: TodoListProps) {
  if (loading) return <Loading />
  if (error) return <div className="alert alert-error">{error}</div>

  if (todos.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          <ClipboardIcon size={28} />
        </div>
        <h3>Chưa có task nào</h3>
        <p>Tạo task mới để bắt đầu quản lý công việc.</p>
      </div>
    )
  }

  return (
    <div className="todo-list">
      {todos.map((todo, index) => (
        <div key={todo.id} style={{ animationDelay: `${index * 40}ms` }}>
          <TodoItem
            todo={todo}
            isManager={isManager}
            onComplete={onComplete}
            onEdit={onEdit}
            onDelete={onDelete}
            onRemind={onRemind}
          />
        </div>
      ))}
    </div>
  )
}
