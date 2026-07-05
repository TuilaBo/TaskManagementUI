import { Input } from '../../../shared/components/Input'
import { FilterIcon, SearchIcon } from '../../../shared/components/Icons'
import { FILTER_OPTIONS } from '../constants'
import type { TaskFilters } from '../types/todo'

interface TodoFilterProps {
  filters: TaskFilters
  onChange: (filters: TaskFilters) => void
}

export function TodoFilter({ filters, onChange }: TodoFilterProps) {
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
