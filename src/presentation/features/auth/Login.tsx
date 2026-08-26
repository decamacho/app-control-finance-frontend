import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router'
import { Field } from '../../components/core/Field'
import { PrimaryButton } from '../../components/core/PrimaryButton'
import { inputCls } from '../../components/core/input'
import { getErrorMessage } from '../../../infrastructure/api/http-client'
import { useLogin } from '../../hooks/useAuth'
import { AuthLayout } from './AuthLayout'
import { PasswordField } from './PasswordField'

export interface LoginInput {
  email: string
  password: string
}

export function Login() {
  const navigate = useNavigate()
  const login = useLogin()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = () => {
    if (!email.trim() || !password) return
    login.mutate({ emailUser: email.trim(), passwordUser: password })
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

      {login.isError && (
        <p className="bg-rose-50 text-rose-700 border border-rose-100 rounded-xl p-3 text-sm mb-5">
          {getErrorMessage(login.error)}
        </p>
      )}

      <PrimaryButton onClick={handleSubmit} disabled={login.isPending} className={login.isPending ? 'opacity-50' : ''}>
        {login.isPending ? <Loader2 size={18} className="animate-spin" /> : null}
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