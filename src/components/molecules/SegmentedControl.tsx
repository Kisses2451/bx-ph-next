import { useId, useRef, type KeyboardEvent } from 'react'

export interface SegmentedControlOption {
  value: string
  label: string
}

interface SegmentedControlProps {
  /** Text above the buttons, e.g. "Main game". */
  label: string
  options: SegmentedControlOption[]
  value: string
  onChange: (value: string) => void
  /** Red message under the buttons. */
  error?: string
}

/**
 * A row of joined buttons where exactly one is selected (gold). Used instead of a dropdown when there are
 * only a few choices, e.g. game, department or status in the admin player form. Works like a radio group:
 * Tab moves into it, arrow keys change the choice.
 */
export function SegmentedControl({ label, options, value, onChange, error }: SegmentedControlProps) {
  const labelId = useId()
  const errorId = useId()
  const buttonsRef = useRef<Array<HTMLButtonElement | null>>([])
  const selectedIndex = Math.max(0, options.findIndex((option) => option.value === value))

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 0
    if (!step) return
    event.preventDefault()
    const next = (selectedIndex + step + options.length) % options.length
    onChange(options[next].value)
    buttonsRef.current[next]?.focus()
  }

  return (
    <div className="segmented-field">
      <span id={labelId} className="segmented-field__label">{label}</span>
      <div className="segmented" role="radiogroup" aria-labelledby={labelId} aria-describedby={error ? errorId : undefined} aria-invalid={error ? true : undefined} onKeyDown={handleKeyDown}>
        {options.map((option, index) => {
          const checked = option.value === value
          return (
            <button
              key={option.value}
              ref={(element) => { buttonsRef.current[index] = element }}
              type="button"
              role="radio"
              aria-checked={checked}
              tabIndex={index === selectedIndex ? 0 : -1}
              className="segmented__option"
              onClick={() => onChange(option.value)}
            >
              {option.label}
            </button>
          )
        })}
      </div>
      {error ? <span id={errorId} className="segmented-field__error">{error}</span> : null}
    </div>
  )
}
