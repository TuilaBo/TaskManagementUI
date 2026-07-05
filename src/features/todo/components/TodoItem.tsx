import { Button } from '../../../shared/components/Button'
import {
  BellIcon,
  CheckIcon,
  EditIcon,
  TrashIcon,
} from '../../../shared/components/Icons'
import { TASK_STATUS } from '../constants'
import type { TaskResponse } from '../types/todo'

interface TodoItemProps {
  todo: TaskResponse
  isManager: boolean
  onComplete: (todo: TaskResponse) => void
  onEdit: (todo: TaskResponse) => void
  onDelete: (id: number) => void
  onRemind: (todo: TaskResponse) => void
}

function isOverdue(deadline: string | null, status: TaskResponse['status']) {
  if (!deadline || status === TASK_STATUS.COMPLETED) return false
  return new Date(deadline) < new Date()
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function TodoItem({
  todo,
  isManager,
  onComplete,
  onEdit,
  onDelete,
  onRemind,
}: TodoItemProps) {
  const isCompleted = todo.status === TASK_STATUS.COMPLETED
  const overdue = isOverdue(todo.deadline, todo.status)

  return (
    <article className={`todo-item ${isCompleted ? 'completed' : ''}`}>
      <div className="todo-item-header">
        <div className="todo-title-section">
          <div className="todo-meta-top">
            <span className="todo-category">{todo.categoryName || 'Công việc'}</span>
            <span className="todo-id">#{todo.id}</span>
          </div>
          <h3 className="todo-title">{todo.title}</h3>
        </div>
      </div>

      {todo.description && (
        <div className="todo-description-box">
          <span className="note-tag note-tag-manager">📋 Ghi chú cho nhân viên</span>
          <p className="box-content">{todo.description}</p>
        </div>
      )}

      {todo.completionNote && (
        <div className="todo-employee-note">
          <span className="note-tag note-tag-employee">📝 Nhân viên note</span>
          <p className="note-content">{todo.completionNote}</p>
        </div>
      )}

      <div className="todo-info-grid">
        {todo.assignedToId && todo.assignedToUsername && (
          <div className="todo-info-item">
            <span className="info-label">Người thực hiện</span>
            <span className="info-value">{todo.assignedToUsername}</span>
          </div>
        )}
        {todo.createdByUsername && (
          <div className="todo-info-item">
            <span className="info-label">Người giao</span>
            <span className="info-value">{todo.createdByUsername}</span>
          </div>
        )}
        {todo.startDate && (
          <div className="todo-info-item">
            <span className="info-label">Bắt đầu</span>
            <span className="info-value">{formatDate(todo.startDate)}</span>
          </div>
        )}
        {todo.deadline && (
          <div className={`todo-info-item ${overdue ? 'overdue' : ''}`}>
            <span className="info-label">{overdue ? 'Quá hạn' : 'Hạn chót'}</span>
            <span className="info-value">{formatDate(todo.deadline)}</span>
          </div>
        )}
      </div>

      {isCompleted && todo.completedAt && (
        <div className="completion-info">
          <p className="completion-meta">
            Hoàn thành lúc: {formatDate(todo.completedAt)}
          </p>
          {todo.proofImageUrl && (
            <a
              href={todo.proofImageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="proof-link"
            >
              <img
                src={todo.proofImageUrl}
                alt="Ảnh bằng chứng từ nhân viên"
                className="proof-thumbnail"
              />
            </a>
          )}
        </div>
      )}

      <div className="todo-actions">
        {!isManager && !isCompleted && (
          <Button
            size="sm"
            variant="primary"
            icon={<CheckIcon size={15} />}
            onClick={() => onComplete(todo)}
          >
            Hoàn thành
          </Button>
        )}
        {isManager && (
          <Button
            size="sm"
            variant="secondary"
            icon={<EditIcon size={15} />}
            onClick={() => onEdit(todo)}
          >
            Sửa
          </Button>
        )}
        {isManager && (
          <Button
            size="sm"
            variant="danger"
            icon={<TrashIcon size={15} />}
            onClick={() => onDelete(todo.id)}
          >
            Xóa
          </Button>
        )}
        {isManager && !isCompleted && (
          <Button
            size="sm"
            variant="ghost"
            icon={<BellIcon size={15} />}
            onClick={() => onRemind(todo)}
          >
            Nhắc nhở
          </Button>
        )}
      </div>
    </article>
  )
}
