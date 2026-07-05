import { useMemo, useState } from 'react'
import { Button } from '../../../shared/components/Button'
import { Modal } from '../../../shared/components/Modal'
import { Pagination } from '../../../shared/components/Pagination'
import { ClipboardIcon, PlusIcon } from '../../../shared/components/Icons'
import { STORAGE_KEYS } from '../../../shared/constants/api'
import { CompleteTaskModal } from '../components/CompleteTaskModal'
import { TodoFilter } from '../components/TodoFilter'
import { TodoForm } from '../components/TodoForm'
import { TodoList } from '../components/TodoList'
import { TASK_STATUS } from '../constants'
import { useCompleteTodo } from '../hooks/useCompleteTodo'
import { useCreateTodo } from '../hooks/useCreateTodo'
import { useDeleteTodo } from '../hooks/useDeleteTodo'
import { useTodos } from '../hooks/useTodos'
import { useUpdateTodo } from '../hooks/useUpdateTodo'
import type { TaskFilters, TaskRequest, TaskResponse } from '../types/todo'
import type { PaginationInfo } from '../hooks/useTodos'

function DashboardStats({ todos, pagination }: { todos: TaskResponse[]; pagination: PaginationInfo }) {
  const stats = useMemo(() => {
    const pending = todos.filter((t) => t.status === TASK_STATUS.PENDING).length
    const completed = todos.filter((t) => t.status === TASK_STATUS.COMPLETED).length
    return { total: pagination.totalElements, pending, completed }
  }, [todos, pagination.totalElements])

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon stat-icon-total">
          <ClipboardIcon size={22} />
        </div>
        <div>
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Tổng số task</div>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon stat-icon-pending">
          <ClipboardIcon size={22} />
        </div>
        <div>
          <div className="stat-value">{stats.pending}</div>
          <div className="stat-label">Chưa hoàn thành</div>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon stat-icon-completed">
          <ClipboardIcon size={22} />
        </div>
        <div>
          <div className="stat-value">{stats.completed}</div>
          <div className="stat-label">Đã hoàn thành</div>
        </div>
      </div>
    </div>
  )
}

export function TodoPage() {
  const role = localStorage.getItem(STORAGE_KEYS.ROLE)
  const isManager = role === 'MANAGER'

  const [filters, setFilters] = useState<TaskFilters>({ size: 5 })
  const [page, setPage] = useState(0)
  const [showForm, setShowForm] = useState(false)
  const [editingTodo, setEditingTodo] = useState<TaskResponse | null>(null)
  const [completingTodo, setCompletingTodo] = useState<TaskResponse | null>(null)

  const { todos, loading, error, refetch, pagination } = useTodos({ ...filters, page })
  const { createTodo, loading: creating } = useCreateTodo()
  const { updateTodo, sendReminder, loading: updating } = useUpdateTodo()
  const { deleteTodo } = useDeleteTodo()
  const {
    completeTodo,
    loading: completing,
    error: completeError,
  } = useCompleteTodo()

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const handleSizeChange = (newSize: number) => {
    setFilters((prev) => ({ ...prev, size: newSize }))
    setPage(0)
  }

  const handleFilterChange = (newFilters: TaskFilters) => {
    setFilters(newFilters)
    setPage(0)
  }

  const handleCreate = async (data: TaskRequest) => {
    const result = await createTodo(data)
    if (result) {
      setShowForm(false)
      refetch()
    }
  }

  const handleUpdate = async (data: TaskRequest) => {
    if (!editingTodo) return
    if (editingTodo.status === TASK_STATUS.COMPLETED) {
      alert('Không thể sửa công việc đã hoàn thành')
      setEditingTodo(null)
      return
    }
    const result = await updateTodo(editingTodo.id, data)
    if (result) {
      setEditingTodo(null)
      refetch()
    }
  }

  const handleComplete = async (note: string, image?: File) => {
    if (!completingTodo) return
    const result = await completeTodo(completingTodo.id, { note, image })
    if (result) {
      setCompletingTodo(null)
      refetch()
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc muốn xóa task này?')) return
    const ok = await deleteTodo(id)
    if (ok) refetch()
  }

  const handleRemind = async (todo: TaskResponse) => {
    const confirmed = window.confirm(
      `Bạn sẽ gửi email nhắc nhở hoàn thành công việc cho nhân viên "${todo.assignedToUsername || todo.title}".\n\nCó muốn thực hiện không?`
    )
    if (!confirmed) return
    const ok = await sendReminder(todo.id)
    if (ok) alert('Đã gửi email nhắc nhở')
  }

  return (
    <div className="todo-page">
      <header className="page-header">
        <div>
          <h1>Quản lý Task</h1>
          <p className="page-header-sub">
            Theo dõi và quản lý công việc của bạn
          </p>
        </div>
        <div className="header-actions">
          {isManager && (
            <Button icon={<PlusIcon size={18} />} onClick={() => setShowForm(true)}>
              Giao việc
            </Button>
          )}
        </div>
      </header>

      {!loading && !error && <DashboardStats todos={todos} pagination={pagination} />}

      <TodoFilter filters={filters} onChange={handleFilterChange} />

      <TodoList
        todos={todos}
        loading={loading}
        error={error}
        isManager={isManager}
        onComplete={setCompletingTodo}
        onEdit={setEditingTodo}
        onDelete={handleDelete}
        onRemind={handleRemind}
      />

      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        totalElements={pagination.totalElements}
        size={pagination.size}
        onPageChange={handlePageChange}
        onSizeChange={handleSizeChange}
      />

      <Modal open={showForm} title="Giao việc theo danh mục" onClose={() => setShowForm(false)}>
        <TodoForm
          isManager={isManager}
          loading={creating}
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      </Modal>

      <Modal
        open={!!editingTodo}
        title="Chỉnh sửa task"
        onClose={() => setEditingTodo(null)}
      >
        {editingTodo && (
          <TodoForm
            initial={editingTodo}
            isManager={isManager}
            loading={updating}
            onSubmit={handleUpdate}
            onCancel={() => setEditingTodo(null)}
          />
        )}
      </Modal>

      <CompleteTaskModal
        todo={completingTodo}
        loading={completing}
        error={completeError}
        onClose={() => setCompletingTodo(null)}
        onSubmit={handleComplete}
      />
    </div>
  )
}
