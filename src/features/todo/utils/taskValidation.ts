export function validateTaskDates(
  startDate: string,
  deadline: string,
): string | null {
  const now = new Date()
  const start = new Date(startDate)
  const end = new Date(deadline)

  if (start < now) {
    return 'Ngày bắt đầu không được trong quá khứ'
  }
  if (end < now) {
    return 'Hạn chót không được trong quá khứ'
  }
  if (start >= end) {
    return 'Ngày bắt đầu phải trước hạn chót'
  }
  return null
}
