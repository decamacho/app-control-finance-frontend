import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router'
import { Field } from '../../components/core/Field'
import { PrimaryButton } from '../../components/core/PrimaryButton'
import { inputCls } from '../../components/core/input'
import { AuthLayout } from './AuthLayout'
import { PasswordField } from './PasswordField'

export interface RegisterInput {
  name: string
  email: string
  password: string
}

interface RegisterScreenProps {
  loading?: boolean
  error?: string | null
  onRegister: (input: RegisterInput) => void
}

export function RegisterScreen({ loading, error, onRegister }: RegisterScreenProps) {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)

  const handleSubmit = () => {
    if (!name.trim() || !email.trim() || !password) {
      setLocalError('Todos los campos son obligatorios')
      return
    }
    if (password !== confirmPassword) {
      setLocalError('Las contraseñas no coinciden')
      return
    }
    setLocalError(null)
    onRegister({ name: name.trim(), email: email.trim(), password })
  }

  const showError = error ?? localError

  return (
    <AuthLayout title="Crea tu cuenta" subtitle="Regístrate con tu correo electrónico">
      <Field label="Nombre">
        <input
          className={inputCls}
          placeholder="Tu nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Field>

      <Field label="Correo electrónico">
        <input
          type="email"
          className={inputCls}
          placeholder="tucorreo@ejemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Field>

      <Field label="Contraseña">
        <PasswordField value={password} onChange={setPassword} />
        <p className="text-xs text-muted-foreground mt-2">Mínimo 8 caracteres</p>
      </Field>

      <Field label="Confirmar contraseña">
        <PasswordField value={confirmPassword} onChange={setConfirmPassword} placeholder="••••••••" />
      </Field>

      {showError && (
        <p className="bg-rose-50 text-rose-700 border border-rose-100 rounded-xl p-3 text-sm mb-5">{showError}</p>
      )}

      <PrimaryButton onClick={handleSubmit} disabled={loading} className={loading ? 'opacity-50' : ''}>
        {loading ? <Loader2 size={18} className="animate-spin" /> : null}
        Crear cuenta
      </PrimaryButton>

      <p className="text-sm text-muted-foreground text-center mt-5">
        ¿Ya tienes cuenta?{' '}
        <button type="button" onClick={() => navigate('/login')} className="text-primary font-bold cursor-pointer">
          Inicia sesión
        </button>
      </p>
    </AuthLayout>
  )
}