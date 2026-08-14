import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router'
import { Field } from '../../components/core/Field'
import { PrimaryButton } from '../../components/core/PrimaryButton'
import { inputCls } from '../../components/core/input'
import { AuthLayout } from './AuthLayout'
import { PasswordField } from './PasswordField'

export interface LoginInput {
  email: string
  password: string
}

interface LoginScreenProps {
  loading?: boolean
  error?: string | null
  onLogin: (input: LoginInput) => void
}

export function LoginScreen({ loading, error, onLogin }: LoginScreenProps) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = () => {
    if (!email.trim() || !password) return
    onLogin({ email: email.trim(), password })
  }

  return (
    <AuthLayout title="Inicia sesión" subtitle="Accede a tu control financiero">
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
      </Field>

      <button
        type="button"
        onClick={() => navigate('/forgot-password')}
        className="block ml-auto mb-5 text-sm font-bold text-primary hover:underline cursor-pointer"
      >
        ¿Olvidaste tu contraseña?
      </button>

      {error && (
        <p className="bg-rose-50 text-rose-700 border border-rose-100 rounded-xl p-3 text-sm mb-5">{error}</p>
      )}

      <PrimaryButton onClick={handleSubmit} disabled={loading} className={loading ? 'opacity-50' : ''}>
        {loading ? <Loader2 size={18} className="animate-spin" /> : null}
        Iniciar sesión
      </PrimaryButton>

      <p className="text-sm text-muted-foreground text-center mt-5">
        ¿No tienes cuenta?{' '}
        <button type="button" onClick={() => navigate('/register')} className="text-primary font-bold cursor-pointer">
          Regístrate
        </button>
      </p>
    </AuthLayout>
  )
}