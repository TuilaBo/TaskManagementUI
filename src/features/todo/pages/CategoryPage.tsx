import { useState } from 'react'
import { Button } from '../../../shared/components/Button'
import { Modal } from '../../../shared/components/Modal'
import { Input } from '../../../shared/components/Input'
import { Loading } from '../../../shared/components/Loading'
import { EditIcon, FilterIcon, PlusIcon, TrashIcon } from '../../../shared/components/Icons'
import { STORAGE_KEYS } from '../../../shared/constants/api'
import { useCategories } from '../hooks/useCategories'
import { useCategoryMutations } from '../hooks/useCategoryMutations'
import type { TaskCategory } from '../types/category'

function CategoryForm({
  initial,
  loading,
  onSubmit,
  onCancel,
}: {
  initial?: TaskCategory | null
  loading: boolean
  onSubmit: (name: string, description: string) => void
  onCancel: () => void
}) {
  const [name, setName] = useState(initial?.name ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')

  return (
    <form
      className="todo-form"
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit(name.trim(), description.trim())
      }}
    >
      <Input
        label="Tên danh mục"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        maxLength={100}
        placeholder="VD: Báo cáo"
      />
      <div className="field">
        <label htmlFor="cat-desc" className="field-label">
          Mô tả
        </label>
        <textarea
          id="cat-desc"
          className="textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          maxLength={500}
          placeholder="Mô tả danh mục..."
        />
      </div>
      <div className="form-actions">
        <Button type="submit" loading={loading}>
          {initial ? 'Cập nhật' : 'Tạo danh mục'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Hủy
        </Button>
      </div>
    </form>
  )
}

export function CategoryPage() {
  const role = localStorage.getItem(STORAGE_KEYS.ROLE)
  const isManager = role === 'MANAGER'

  const { categories, loading, error, refetch } = useCategories()
  const { createCategory, updateCategory, deleteCategory, loading: mutating } =
    useCategoryMutations()

  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<TaskCategory | null>(null)

  const handleCreate = async (name: string, description: string) => {
    const result = await createCategory({ name, description: description || undefined })
    if (result) {
      setShowForm(false)
      refetch()
    }
  }

  const handleUpdate = async (name: string, description: string) => {
    if (!editing) return
    const result = await updateCategory(editing.id, {
      name,
      description: description || undefined,
    })
    if (result) {
      setEditing(null)
      refetch()
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Xóa danh mục này?')) return
    const ok = await deleteCategory(id)
    if (ok) refetch()
  }

  return (
    <div className="category-page">
      <header className="page-header">
        <div>
          <h1>Danh mục công việc</h1>
          <p className="page-header-sub">
            Phân loại task: Báo cáo, Họp, Kỹ thuật...
          </p>
        </div>
        {isManager && (
          <div className="header-actions">
            <Button icon={<PlusIcon size={18} />} onClick={() => setShowForm(true)}>
              Thêm danh mục
            </Button>
          </div>
        )}
      </header>

      {loading && <Loading />}
      {error && <div className="alert alert-error">{error}</div>}

      {!loading && !error && (
        <div className="category-grid">
          {categories.map((cat) => (
            <article key={cat.id} className="category-card">
              <div className="category-card-icon">
                <FilterIcon size={20} />
              </div>
              <div className="category-card-body">
                <h3>{cat.name}</h3>
                {cat.description && <p>{cat.description}</p>}
              </div>
              {isManager && (
                <div className="category-card-actions">
                  <Button
                    size="sm"
                    variant="secondary"
                    icon={<EditIcon size={14} />}
                    onClick={() => setEditing(cat)}
                  >
                    Sửa
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    icon={<TrashIcon size={14} />}
                    onClick={() => handleDelete(cat.id)}
                  >
                    Xóa
                  </Button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}

      <Modal open={showForm} title="Tạo danh mục mới" onClose={() => setShowForm(false)}>
        <CategoryForm
          loading={mutating}
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      </Modal>

      <Modal
        open={!!editing}
        title="Chỉnh sửa danh mục"
        onClose={() => setEditing(null)}
      >
        {editing && (
          <CategoryForm
            initial={editing}
            loading={mutating}
            onSubmit={handleUpdate}
            onCancel={() => setEditing(null)}
          />
        )}
      </Modal>
    </div>
  )
}
