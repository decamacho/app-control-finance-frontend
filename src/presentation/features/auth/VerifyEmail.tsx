import { CheckCircle2, Loader2, XCircle } from 'lucide-react'
import { useNavigate, useParams } from 'react-router'
import { useVerifyEmail } from '../../hooks/useAuth'
import { getErrorMessage } from '../../../infrastructure/api/http-client'
import { PrimaryButton } from '../../components/core/PrimaryButton'
import { AuthLayout } from './AuthLayout'

export function VerifyEmail() {
  const { token } = useParams<{ token: string }>()
  const navigate = useNavigate()
  const verify = useVerifyEmail(token ?? '')

  return (
    <AuthLayout title="Verificación de correo" subtitle="Confirmando tu cuenta">
      {verify.isLoading && (
        <div className="flex flex-col items-center gap-3 py-6">
          <Loader2 size={32} className="animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Verificando tu correo…</p>
        </div>
      )}

      {verify.isSuccess && (
        <div className="flex flex-col items-center gap-4 py-4">
          <CheckCircle2 size={44} className="text-emerald-500" />
          <p className="text-sm text-muted-foreground text-center">
            Tu correo fue verificado correctamente. Ya puedes iniciar sesión.
          </p>
          <PrimaryButton onClick={() => navigate('/login')} className="w-full">
            Ir a iniciar sesión
          </PrimaryButton>
        </div>
      )}

      {verify.isError && (
        <div className="flex flex-col items-center gap-4 py-4">
          <XCircle size={44} className="text-rose-500" />
          <p className="bg-rose-50 text-rose-700 border border-rose-100 rounded-xl p-3 text-sm w-full text-center">
            {getErrorMessage(verify.error)}
          </p>
          <PrimaryButton onClick={() => navigate('/login')} className="w-full">
            Volver a iniciar sesión
          </PrimaryButton>
        </div>
      )}
    </AuthLayout>
  )
}