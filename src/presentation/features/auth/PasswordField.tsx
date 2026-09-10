import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { inputCls } from '../../components/core/input'

interface PasswordFieldProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  name?: string
  autoComplete?: string
}

export function PasswordField({ value, onChange, placeholder = '••••••••', name, autoComplete }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="relative">
      <input
        type={visible ? 'text' : 'password'}
        className={inputCls + ' pr-12'}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        name={name}
        autoComplete={autoComplete}
      />
      <button
        type="button"
        aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        onClick={() => setVisible((prev) => !prev)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
      >
        {visible ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  )
}