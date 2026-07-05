import { ChevronLeftIcon, ChevronRightIcon } from './Icons'

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalElements: number
  size: number
  onPageChange: (page: number) => void
  onSizeChange: (size: number) => void
}

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100]

export function Pagination({
  currentPage,
  totalPages,
  totalElements,
  size,
  onPageChange,
  onSizeChange,
}: PaginationProps) {
  if (totalPages <= 0 && totalElements === 0) return null

  const startItem = totalElements === 0 ? 0 : currentPage * size + 1
  const endItem = Math.min((currentPage + 1) * size, totalElements)

  const pages: (number | 'ellipsis')[] = []
  if (totalPages <= 7) {
    for (let i = 0; i < totalPages; i++) pages.push(i)
  } else {
    pages.push(0)
    if (currentPage > 2) pages.push('ellipsis')
    const start = Math.max(1, currentPage - 1)
    const end = Math.min(totalPages - 2, currentPage + 1)
    for (let i = start; i <= end; i++) pages.push(i)
    if (currentPage < totalPages - 3) pages.push('ellipsis')
    pages.push(totalPages - 1)
  }

  return (
    <div className="pagination">
      <div className="pagination-left">
        <div className="pagination-info">
          Hiển thị <strong>{startItem}</strong> - <strong>{endItem}</strong> của{' '}
          <strong>{totalElements}</strong> kết quả
        </div>
        <div className="pagination-size">
          <label className="size-label">Hiển thị:</label>
          <select
            className="size-select"
            value={size}
            onChange={(e) => onSizeChange(Number(e.target.value))}
          >
            {PAGE_SIZE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt} / trang
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="pagination-controls">
        <button
          className="pagination-btn"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          aria-label="Trang trước"
        >
          <ChevronLeftIcon size={18} />
        </button>

        {pages.map((p, i) =>
          p === 'ellipsis' ? (
            <span key={`ellipsis-${i}`} className="pagination-ellipsis">
              ...
            </span>
          ) : (
            <button
              key={p}
              className={`pagination-btn ${p === currentPage ? 'active' : ''}`}
              onClick={() => onPageChange(p)}
              aria-label={`Trang ${p + 1}`}
              aria-current={p === currentPage ? 'page' : undefined}
            >
              {p + 1}
            </button>
          ),
        )}

        <button
          className="pagination-btn"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
          aria-label="Trang sau"
        >
          <ChevronRightIcon size={18} />
        </button>
      </div>
    </div>
  )
}
