import { Input } from '../../../shared/components/Input'
import { FilterIcon, SearchIcon } from '../../../shared/components/Icons'
import { useStaff } from '../hooks/useStaff'
import { FILTER_OPTIONS } from '../constants'
import type { TaskFilters } from '../types/todo'

interface TodoFilterProps {
  filters: TaskFilters
  onChange: (filters: TaskFilters) => void
}

export function TodoFilter({ filters, onChange }: TodoFilterProps) {
  const { staff, loading: staffLoading } = useStaff(true)

  return (
    <div className="filter-bar">
      <div className="field">
        <div className="filter-bar-label">
          <FilterIcon size={14} />
          Trạng thái
        </div>
        <select
          id="status-filter"
          className="select"
          value={filters.status ?? ''}
          onChange={(e) =>
            onChange({
              ...filters,
              status: e.target.value
                ? (e.target.value as TaskFilters['status'])
                : undefined,
            })
          }
        >
          {FILTER_OPTIONS.map((opt) => (
            <option key={opt.value || 'all'} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <div className="filter-bar-label">
          <FilterIcon size={14} />
          Nhân viên
        </div>
        <select
          id="staff-filter"
          className="select"
          value={filters.assignedToId ?? ''}
          disabled={staffLoading}
          onChange={(e) =>
            onChange({
              ...filters,
              assignedToId: e.target.value ? Number(e.target.value) : undefined,
            })
          }
        >
          <option value="">Tất cả nhân viên</option>
          {staff.map((s) => (
            <option key={s.id} value={s.id}>
              {s.username}
            </option>
          ))}
        </select>
      </div>

      <Input
        label="Tìm kiếm"
        placeholder="Tìm trong tiêu đề, mô tả..."
        value={filters.keyword ?? ''}
        iconLeft={<SearchIcon size={18} />}
        onChange={(e) =>
          onChange({
            ...filters,
            keyword: e.target.value || undefined,
          })
        }
      />
    </div>
  )
}
