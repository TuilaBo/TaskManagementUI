import { useEffect, useState } from 'react'
import { Button } from '../../../shared/components/Button'
import { Input } from '../../../shared/components/Input'
import { DateTimePicker } from '../../../shared/components/DateTimePicker'
import { useCategories } from '../hooks/useCategories'
import { useStaff } from '../hooks/useStaff'
import { validateTaskDates } from '../utils/taskValidation'
import type { TaskRequest, TaskResponse } from '../types/todo'

interface TodoFormProps {
  initial?: TaskResponse | null
  isManager: boolean
  loading?: boolean
  onSubmit: (data: TaskRequest) => void
  onCancel: () => void
}

function toDatetimeLocal(value: string | null | undefined) {
  return value ? value.slice(0, 16) : ''
}

export function TodoForm({
  initial,
  isManager,
  loading = false,
  onSubmit,
  onCancel,
}: TodoFormProps) {
  const isEditing = !!initial
  const { staff, loading: staffLoading, error: staffError } = useStaff(isManager)
  const { categories, loading: categoriesLoading, error: categoriesError } =
    useCategories(isManager)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [assignedToId, setAssignedToId] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [startDate, setStartDate] = useState('')
  const [deadline, setDeadline] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [selectedCategoryName, setSelectedCategoryName] = useState('')

  useEffect(() => {
    if (initial) {
      setTitle(initial.title ?? '')
      setDescription(initial.description ?? '')
      setAssignedToId(initial.assignedToId ? String(initial.assignedToId) : '')
      setCategoryId(initial.categoryId ? String(initial.categoryId) : '')
      setStartDate(toDatetimeLocal(initial.startDate))
      setDeadline(toDatetimeLocal(initial.deadline))
    }
  }, [initial])

  useEffect(() => {
    if (categoryId) {
      const cat = categories.find((c) => c.id === Number(categoryId))
      setSelectedCategoryName(cat?.name ?? '')
    } else {
      setSelectedCategoryName('')
    }
  }, [categoryId, categories])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    const data: TaskRequest = {}

    if (description.trim()) data.description = description.trim()

    // Title is required - use category name if empty, otherwise use entered title
    const finalTitle = title.trim() || selectedCategoryName
    if (!finalTitle) {
      setFormError('Vui lòng nhập tiêu đề hoặc chọn danh mục công việc')
      return
    }
    data.title = finalTitle

    if (isManager) {
      if (!categoryId) {
        setFormError('Vui lòng chọn danh mục công việc')
        return
      }
      if (!assignedToId) {
        setFormError('Vui lòng chọn nhân viên được giao việc')
        return
      }
      if (!startDate) {
        setFormError('Vui lòng chọn ngày bắt đầu')
        return
      }
      if (!deadline) {
        setFormError('Vui lòng chọn hạn chót')
        return
      }

      const dateError = validateTaskDates(startDate, deadline)
      if (dateError) {
        setFormError(dateError)
        return
      }

      data.categoryId = Number(categoryId)
      data.assignedToId = Number(assignedToId)
      data.startDate = startDate
      data.deadline = deadline
    }

    onSubmit(data)
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      {isManager && (
        <>
          <div className="field">
            <label htmlFor="categoryId" className="field-label">
              Danh mục công việc
            </label>
            <select
              id="categoryId"
              className="select"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              disabled={categoriesLoading}
            >
              <option value="">
                {categoriesLoading ? 'Đang tải...' : 'Chọn danh mục (Báo cáo, Họp, Kỹ thuật...)'}
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                  {cat.description ? ` — ${cat.description}` : ''}
                </option>
              ))}
            </select>
            {categoriesError && (
              <span className="field-error">{categoriesError}</span>
            )}
            {!isEditing && (
              <span className="field-hint">
                Tiêu đề sẽ tự động lấy từ tên danh mục nếu bỏ trống
              </span>
            )}
          </div>

          <div className="field">
            <label htmlFor="assignedToId" className="field-label">
              Giao cho nhân viên
            </label>
            <select
              id="assignedToId"
              className="select"
              value={assignedToId}
              onChange={(e) => setAssignedToId(e.target.value)}
              required
              disabled={staffLoading}
            >
              <option value="">
                {staffLoading ? 'Đang tải danh sách...' : 'Chọn nhân viên'}
              </option>
              {staff.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.username} ({member.email})
                </option>
              ))}
            </select>
            {staffError && <span className="field-error">{staffError}</span>}
          </div>

          <div className="form-date-row">
            <DateTimePicker
              label="Ngày bắt đầu"
              value={startDate}
              onChange={(val) => setStartDate(val)}
              required
            />
          </div>
          <div className="form-date-row">
            <DateTimePicker
              label="Hạn chót"
              value={deadline}
              onChange={(val) => setDeadline(val)}
              minDate={startDate || undefined}
              required
            />
          </div>
        </>
      )}

      <div className="field">
        <label htmlFor="description" className="field-label">
          Mô tả (tùy chọn)
        </label>
        <textarea
          id="description"
          className="textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={2000}
          rows={3}
          placeholder="Ghi chú thêm cho công việc..."
        />
      </div>

      {!isEditing && (
        <div className="field">
          <label htmlFor="title" className="field-label">
            Tiêu đề
          </label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={200}
            placeholder={`Để trống sẽ dùng tên danh mục (${selectedCategoryName || 'chưa chọn'})`}
          />
        </div>
      )}

      {isEditing && (
        <Input
          label="Tiêu đề (tùy chọn)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={200}
          placeholder="Để trống nếu dùng tên danh mục"
        />
      )}

      {formError && <div className="alert alert-error">{formError}</div>}

      <div className="form-actions">
        <Button type="submit" loading={loading}>
          {initial ? 'Cập nhật' : 'Giao việc'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Hủy
        </Button>
      </div>
    </form>
  )
}
