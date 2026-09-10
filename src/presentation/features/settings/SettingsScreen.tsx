import { User, Building2, LogOut, Mail, CheckCircle2, Loader2 } from 'lucide-react'
import { useSession, useResendVerify, useLogout } from '@/hooks/useAuth'
import { useCurrentBusiness } from '@/hooks/useCurrentBusiness'

export function SettingsScreen() {
  const { data: user, isLoading: loadingUser } = useSession()
  const { currentBusiness, isLoading: loadingBusiness } = useCurrentBusiness()

  const resendVerify = useResendVerify()
  const logout = useLogout()

  const handleLogout = () => {
    logout.mutate()
  }

  if (loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 size={28} className="animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center bg-background">No autenticado</div>
  }

  const initials = `${user.firstNameUser?.[0] ?? ''}${user.lastNameUser?.[0] ?? ''}`.toUpperCase() || 'AR'

  return (
    <div className="pb-6">
      {/* Header */}
      <div className="px-5 pt-7 pb-4">
        <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
          <User size={22} className="text-primary" />
          Configuración
        </h1>
        <p className="text-muted-foreground text-sm mt-0.5">Gestiona tu cuenta y preferencias</p>
      </div>

      {/* Perfil */}
      <section className="mx-5 mb-5">
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center text-white text-2xl font-bold flex-shrink-0"
              style={{ background: 'var(--gradient-brand)' }}
            >
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-lg font-bold text-foreground truncate">
                {user.firstNameUser} {user.lastNameUser}
              </p>
              <p className="text-sm text-muted-foreground truncate">{user.emailUser}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-secondary text-foreground">
                  {user.role?.nameRole ?? 'USER'}
                </span>
                {user.isVerifyUser ? (
                  <span className="flex items-center gap-1 px-2 py-0.5 text-xs font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                    <CheckCircle2 size={10} />
                    Verificado
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => resendVerify.mutate(user.emailUser)}
                    disabled={resendVerify.isPending}
                    className="flex items-center gap-1 px-2 py-0.5 text-xs font-bold rounded-full bg-amber-50 text-amber-700 border border-amber-100"
                  >
                    <Mail size={10} />
                    {resendVerify.isPending ? 'Reenviando…' : 'Reenviar verificación'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Negocio */}
      <section className="mx-5 mb-5">
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
              <Building2 size={18} />
            </div>
            <h2 className="text-lg font-bold text-foreground">Negocio actual</h2>
          </div>
          {loadingBusiness ? (
            <p className="text-sm text-muted-foreground">Cargando…</p>
          ) : currentBusiness ? (
            <div className="flex items-center justify-between p-3 bg-secondary rounded-xl">
              <div>
                <p className="font-bold text-foreground">{currentBusiness.nameBusiness}</p>
                <p className="text-xs text-muted-foreground">{currentBusiness.businessType}</p>
              </div>
              <span className="px-2 py-1 text-xs font-bold bg-primary text-primary-foreground rounded">Activo</span>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No hay negocio seleccionado</p>
          )}
        </div>
      </section>

      {/* Cerrar sesión */}
      <section className="mx-5 mb-5">
        <div className="bg-card border border-border rounded-2xl p-5">
          <button
            type="button"
            onClick={handleLogout}
            disabled={logout.isPending}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100 transition-colors text-left font-bold"
          >
            <LogOut size={20} />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </section>
    </div>
  )
}