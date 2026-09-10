import { useState } from 'react'
import { Loader2, MailCheck } from 'lucide-react'
import { useNavigate } from 'react-router'
import { Field } from '../../components/core/Field'
import { PrimaryButton } from '../../components/core/PrimaryButton'
import { inputCls } from '../../components/core/input'
import { getErrorMessage } from '../../../infrastructure/api/http-client'
import { useRegister, useResendVerify } from '../../hooks/useAuth'
import { AuthLayout } from './AuthLayout'
import { PasswordField } from './PasswordField'

export interface RegisterInput {
  name: string
  email: string
  password: string
}

export function Register() {
  const navigate = useNavigate()
  const register = useRegister()
  const resendVerify = useResendVerify()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null)

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
    register.mutate(
      { nameUser: name.trim(), emailUser: email.trim(), passwordUser: password },
      { onSuccess: () => setRegisteredEmail(email.trim()) },
    )
  }

  const showError = localError ?? (register.isError ? getErrorMessage(register.error) : null)

  if (registeredEmail) {
    return (
      <AuthLayout title="Revisa tu correo" subtitle="Casi listo para empezar">
        <div className="flex flex-col items-center gap-4 py-4">
          <MailCheck size={44} className="text-primary" />
          <p className="text-sm text-muted-foreground text-center">
            Te enviamos un enlace de verificación a <span className="font-bold text-foreground">{registeredEmail}</span>.
            Revisa tu bandeja de entrada para activar tu cuenta.
          </p>

          {resendVerify.isError && (
            <p className="bg-rose-50 text-rose-700 border border-rose-100 rounded-xl p-3 text-sm w-full text-center">
              {getErrorMessage(resendVerify.error)}
            </p>
          )}
          {resendVerify.isSuccess && (
            <p className="bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl p-3 text-sm w-full text-center">
              Correo reenviado, revisa tu bandeja de entrada.
            </p>
          )}

          <button
            type="button"
            onClick={() => resendVerify.mutate(registeredEmail)}
            disabled={resendVerify.isPending}
            className="text-sm font-bold text-primary hover:underline cursor-pointer"
          >
            {resendVerify.isPending ? 'Reenviando…' : '¿No llegó el correo? Reenviar'}
          </button>

          <PrimaryButton onClick={() => navigate('/login')} className="w-full">
            Ir a iniciar sesión
          </PrimaryButton>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title="Crea tu cuenta" subtitle="Regístrate con tu correo electrónico">
      <form noValidate onSubmit={(e) => { e.preventDefault(); handleSubmit() }}>
        <Field label="Nombre">
          <input
            className={inputCls}
            name="name"
            autoComplete="name"
            placeholder="Tu nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Field>

        <Field label="Correo electrónico">
          <input
            type="email"
            className={inputCls}
            name="email"
            autoComplete="email"
            placeholder="tucorreo@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>

        <Field label="Contraseña">
          <PasswordField value={password} onChange={setPassword} name="new-password" autoComplete="new-password" />
          <p className="text-xs text-muted-foreground mt-2">Mínimo 8 caracteres</p>
        </Field>

        <Field label="Confirmar contraseña">
          <PasswordField
            value={confirmPassword}
            onChange={setConfirmPassword}
            placeholder="••••••••"
            name="confirm-password"
            autoComplete="new-password"
          />
        </Field>

        {showError && (
          <p className="bg-rose-50 text-rose-700 border border-rose-100 rounded-xl p-3 text-sm mb-5">{showError}</p>
        )}

        <PrimaryButton type="submit" onClick={handleSubmit} disabled={register.isPending} className={register.isPending ? 'opacity-50' : ''}>
          {register.isPending ? <Loader2 size={18} className="animate-spin" /> : null}
          Crear cuenta
        </PrimaryButton>
      </form>

      <p className="text-sm text-muted-foreground text-center mt-5">
        ¿Ya tienes cuenta?{' '}
        <button type="button" onClick={() => navigate('/login')} className="text-primary font-bold cursor-pointer">
          Inicia sesión
        </button>
      </p>
    </AuthLayout>
  )
}