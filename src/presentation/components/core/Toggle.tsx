import type { LucideIcon } from 'lucide-react'

export interface ToggleOption {
  id: string
  label: string
  Icon?: LucideIcon
}

interface ToggleProps {
  options: ToggleOption[]
  value: string
  onChange: (value: string) => void
  tall?: boolean
}

export function Toggle({ options, value, onChange, tall = false }: ToggleProps) {
  return (
    <div className="flex p-1 bg-muted rounded-2xl">
      {options.map((option) => {
        const active = value === option.id
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.id)}
            className={`flex-1 flex items-center justify-center gap-2 rounded-xl text-sm font-bold transition-all ${tall ? 'py-3' : 'py-2'} ${
              active ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:bg-card/60 hover:text-foreground'
            }`}
          >
            {option.Icon && <option.Icon size={16} />}
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
