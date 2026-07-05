import { useState } from 'react'
import { CalendarIcon } from './Icons'

interface DateTimePickerProps {
  label: string
  value: string
  onChange: (value: string) => void
  minDate?: string
  required?: boolean
  placeholder?: string
}

function formatDateForInput(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

function getTodayAt(hours: number, minutes: number = 0): string {
  const date = new Date()
  date.setHours(hours, minutes, 0, 0)
  return formatDateForInput(date)
}

function getTomorrowAt(hours: number, minutes: number = 0): string {
  const date = new Date()
  date.setDate(date.getDate() + 1)
  date.setHours(hours, minutes, 0, 0)
  return formatDateForInput(date)
}

function getEndOfWeek(): string {
  const date = new Date()
  const daysUntilFriday = (5 - date.getDay() + 7) % 7 || 7
  date.setDate(date.getDate() + daysUntilFriday)
  date.setHours(17, 0, 0, 0)
  return formatDateForInput(date)
}

interface QuickOption {
  label: string
  getValue: () => string
}

export function DateTimePicker({
  label,
  value,
  onChange,
  minDate,
  required,
  placeholder = 'Chọn ngày và giờ',
}: DateTimePickerProps) {
  const [showPresets, setShowPresets] = useState(false)

  const presets: QuickOption[] = [
    { label: 'Trong 1 giờ', getValue: () => getTodayAt(new Date().getHours() + 1) },
    { label: 'Hôm nay 17:00', getValue: () => getTodayAt(17, 0) },
    { label: 'Hôm nay 18:00', getValue: () => getTodayAt(18, 0) },
    { label: 'Ngày mai 09:00', getValue: () => getTomorrowAt(9, 0) },
    { label: 'Ngày mai 17:00', getValue: () => getTomorrowAt(17, 0) },
    { label: 'Cuối tuần (T6 17:00)', getValue: getEndOfWeek },
  ]

  return (
    <div className="field">
      <label className="field-label">
        {label}
        {required && <span className="field-required"> *</span>}
      </label>
      <div className="datetime-picker">
        <div className="input-wrapper">
          <span className="input-icon-left">
            <CalendarIcon size={18} />
          </span>
          <input
            type="datetime-local"
            className="input has-icon-left"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            min={minDate}
            required={required}
            placeholder={placeholder}
          />
        </div>
        <div className="datetime-presets">
          <button
            type="button"
            className="preset-toggle"
            onClick={() => setShowPresets(!showPresets)}
            title="Chọn nhanh"
          >
            ⚡
          </button>
          {showPresets && (
            <div className="preset-dropdown">
              {presets.map((preset, i) => (
                <button
                  key={i}
                  type="button"
                  className="preset-item"
                  onClick={() => {
                    onChange(preset.getValue())
                    setShowPresets(false)
                  }}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
