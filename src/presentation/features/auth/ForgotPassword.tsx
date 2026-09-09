import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router'
import { Field } from '../../components/core/Field'
import { PrimaryButton } from '../../components/core/PrimaryButton'
import { inputCls } from '../../components/core/input'
import { AuthLayout } from './AuthLayout'
import { PasswordField } from './PasswordField'

export interface RequestResetInput {
  email: string
}

export interface ConfirmResetInput {
  code: string
  newPassword: string
}

interface ForgotPasswordProps {
  sending?: boolean
  resetting?: boolean
  error?: string | null
  onRequestReset: (input: RequestResetInput) => void
  onConfirmReset: (input: ConfirmResetInput) => void
}

export function ForgotPassword({
  sending,
  resetting,
  error,
  onRequestReset,
  onConfirmReset,
}: ForgotPasswordProps) {
  const navigate = useNavigate()
  const [step, setStep] = useState<'email' | 'code'>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [success, setSuccess] = useState<string | null>(null)
  const [localError, setLocalError] = useState<string | null>(null)

  const handleSendCode = () => {
    if (!email.trim()) {
      setLocalError('Ingresa tu correo electrónico')
      return
    }
    setLocalError(null)
    onRequestReset({ email: email.trim() })
    setSuccess('Revisa tu correo: te enviamos un código para restablecer tu contraseña')
    setStep('code')
  }

  const handleReset = () => {
    if (!code.trim() || !newPassword) {
      setLocalError('Completa el código y la nueva contraseña')
      return
    }
    setLocalError(null)
    onConfirmReset({ code: code.trim(), newPassword })
    setSuccess('Contraseña actualizada. Vuelve a iniciar sesión con tu nueva contraseña')
  }

  const showError = error ?? localError

  return (
    <AuthLayout
      title={step === 'email' ? 'Recupera tu contraseña' : 'Nueva contraseña'}
      subtitle={
        step === 'email'
          ? 'Te enviaremos un código de verificación a tu correo'
          : 'Ingresa el código y define tu nueva contraseña'
      }
    >
      {success && (
        <p className="bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl p-3 text-sm mb-5">
          {success}
        </p>
      )}

      {step === 'email' ? (
        <>
          <Field label="Correo electrónico">
            <input
              type="email"
              className={inputCls}
              placeholder="tucorreo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>

          {showError && (
            <p className="bg-rose-50 text-rose-700 border border-rose-100 rounded-xl p-3 text-sm mb-5">{showError}</p>
          )}

          <PrimaryButton onClick={handleSendCode} disabled={sending} className={sending ? 'opacity-50' : ''}>
            {sending ? <Loader2 size={18} className="animate-spin" /> : null}
            Enviar código
          </PrimaryButton>
        </>
      ) : (
        <>
          <Field label="Código de verificación">
            <input
              className={inputCls + ' font-mono uppercase'}
              placeholder="000000"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </Field>

          <Field label="Nueva contraseña">
            <PasswordField value={newPassword} onChange={setNewPassword} />
            <p className="text-xs text-muted-foreground mt-2">Mínimo 8 caracteres</p>
          </Field>

          {showError && (
            <p className="bg-rose-50 text-rose-700 border border-rose-100 rounded-xl p-3 text-sm mb-5">{showError}</p>
          )}

          <PrimaryButton onClick={handleReset} disabled={resetting} className={resetting ? 'opacity-50' : ''}>
            {resetting ? <Loader2 size={18} className="animate-spin" /> : null}
            Restablecer contraseña
          </PrimaryButton>
        </>
      )}

      <button
        type="button"
        onClick={() => navigate('/login')}
        className="block mx-auto mt-5 text-sm text-muted-foreground font-bold hover:text-foreground transition-colors cursor-pointer"
      >
        Volver a iniciar sesión
      </button>
    </AuthLayout>
  )
}