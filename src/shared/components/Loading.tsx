export function Loading({ message = 'Đang tải dữ liệu...' }: { message?: string }) {
  return (
    <div className="loading" role="status" aria-live="polite">
      <div className="loading-spinner" />
      <span>{message}</span>
    </div>
  )
}
