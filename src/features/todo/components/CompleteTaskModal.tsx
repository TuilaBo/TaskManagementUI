import { useState } from 'react'
import { Button } from '../../../shared/components/Button'
import { Modal } from '../../../shared/components/Modal'
import {
  ALLOWED_PROOF_TYPES,
  MAX_PROOF_SIZE_BYTES,
  type TaskResponse,
} from '../types/todo'

interface CompleteTaskModalProps {
  todo: TaskResponse | null
  loading?: boolean
  error?: string | null
  onClose: () => void
  onSubmit: (note: string, image?: File) => void
}

export function CompleteTaskModal({
  todo,
  loading = false,
  error,
  onClose,
  onSubmit,
}: CompleteTaskModalProps) {
  const [note, setNote] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [localError, setLocalError] = useState<string | null>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalError(null)
    const file = e.target.files?.[0]
    if (!file) {
      setImage(null)
      setPreview(null)
      return
    }

    if (!ALLOWED_PROOF_TYPES.includes(file.type as (typeof ALLOWED_PROOF_TYPES)[number])) {
      setLocalError('Chỉ chấp nhận ảnh JPEG, PNG, WEBP hoặc GIF')
      e.target.value = ''
      return
    }

    if (file.size > MAX_PROOF_SIZE_BYTES) {
      setLocalError('Ảnh không được vượt quá 5MB')
      e.target.value = ''
      return
    }

    setImage(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)
    onSubmit(note, image ?? undefined)
  }

  const handleClose = () => {
    if (preview) URL.revokeObjectURL(preview)
    setNote('')
    setImage(null)
    setPreview(null)
    setLocalError(null)
    onClose()
  }

  return (
    <Modal open={!!todo} title="Hoàn thành công việc" onClose={handleClose}>
      {todo && (
        <form className="todo-form" onSubmit={handleSubmit}>
          <p className="auth-hint">
            Xác nhận hoàn thành: <strong>{todo.title}</strong>
          </p>

          <div className="field">
            <label htmlFor="completion-note" className="field-label">
              Ghi chú hoàn thành (tùy chọn)
            </label>
            <textarea
              id="completion-note"
              className="textarea"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="Mô tả kết quả công việc..."
              maxLength={2000}
            />
          </div>

          <div className="field">
            <label htmlFor="proof-image" className="field-label">
              Ảnh bằng chứng (tùy chọn)
            </label>
            <input
              id="proof-image"
              type="file"
              className="file-input"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleImageChange}
            />
            <span className="field-hint">JPEG, PNG, WEBP, GIF — tối đa 5MB</span>
          </div>

          {preview && (
            <div className="proof-preview">
              <img src={preview} alt="Xem trước ảnh bằng chứng" />
            </div>
          )}

          {(localError || error) && (
            <div className="alert alert-error">{localError ?? error}</div>
          )}

          <div className="form-actions">
            <Button type="submit" loading={loading}>
              Xác nhận hoàn thành
            </Button>
            <Button type="button" variant="secondary" onClick={handleClose}>
              Hủy
            </Button>
          </div>
        </form>
      )}
    </Modal>
  )
}
