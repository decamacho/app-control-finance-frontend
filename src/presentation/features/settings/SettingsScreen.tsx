import { useState } from 'react'
import { User, Shield, Activity, Building2, LogOut, Mail, CheckCircle2, Loader2, X } from 'lucide-react'
import { useSession, useChangePassword, useResendVerify, useSessions, useCloseSession, useCloseAllSessions, useLogout } from '@/hooks/useAuth'
import { useCurrentBusiness } from '@/hooks/useCurrentBusiness'
import { PrimaryButton } from '@/components/core/PrimaryButton'
import { Field } from '@/components/core/Field'
import { FormModal } from '@/components/core/FormModal'
import { inputCls } from '@/components/core/input'
import { getErrorMessage } from '@/infrastructure/api/http-client'

export function SettingsScreen() {
  const { data: user, isLoading: loadingUser } = useSession()
  const { currentBusiness, isLoading: loadingBusiness } = useCurrentBusiness()
  const { data: sessions, isLoading: loadingSessions } = useSessions()

  const changePassword = useChangePassword()
  const resendVerify = useResendVerify()
  const closeSession = useCloseSession()
  const closeAllSessions = useCloseAllSessions()
  const logout = useLogout()

  // Modals state
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [showCloseSessionConfirm, setShowCloseSessionConfirm] = useState<string | null>(null)
  const [showCloseAllConfirm, setShowCloseAllConfirm] = useState(false)

  // Change password form
  const [cpCurrent, setCpCurrent] = useState('')
  const [cpNew, setCpNew] = useState('')
  const [cpConfirm, setCpConfirm] = useState('')
  const [cpError, setCpError] = useState<string | null>(null)

  const handleChangePassword = () => {
    setCpError(null)
    if (!cpCurrent || !cpNew || !cpConfirm) {
      setCpError('Todos los campos son obligatorios')
      return
    }
    if (cpNew !== cpConfirm) {
      setCpError('Las contraseñas nuevas no coinciden')
      return
    }
    if (cpNew.length < 8) {
      setCpError('La nueva contraseña debe tener al menos 8 caracteres')
      return
    }
    changePassword.mutate(
      { currentPassword: cpCurrent, newPassword: cpNew },
      {
        onSuccess: () => {
          setShowChangePassword(false)
          setCpCurrent('')
          setCpNew('')
          setCpConfirm('')
        },
        onError: (error: unknown) => setCpError(getErrorMessage(error)),
      }
    )
  }

  const handleCloseSession = (sessionId: string) => {
    setShowCloseSessionConfirm(sessionId)
  }

  const confirmCloseSession = () => {
    if (showCloseSessionConfirm) {
      closeSession.mutate(showCloseSessionConfirm, { onSuccess: () => setShowCloseSessionConfirm(null) })
    }
  }

  const confirmCloseAllSessions = () => {
    closeAllSessions.mutate(undefined, { onSuccess: () => setShowCloseAllConfirm(false) })
  }

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

      {/* Seguridad */}
      <section className="mx-5 mb-5">
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
              <Shield size={18} />
            </div>
            <h2 className="text-lg font-bold text-foreground">Seguridad</h2>
          </div>
          <button
            type="button"
            onClick={() => setShowChangePassword(true)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
                <Shield size={18} />
              </div>
              <div>
                <p className="font-bold text-foreground">Cambiar contraseña</p>
                <p className="text-xs text-muted-foreground">Actualiza tu contraseña actual</p>
              </div>
            </div>
            <X size={20} className="text-muted-foreground" />
          </button>
        </div>
      </section>

      {/* Sesiones */}
      <section className="mx-5 mb-5">
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <Activity size={18} />
              </div>
              <h2 className="text-lg font-bold text-foreground">Sesiones activas</h2>
            </div>
            {sessions && sessions.length > 1 && (
              <button
                type="button"
                onClick={() => setShowCloseAllConfirm(true)}
                disabled={closeAllSessions.isPending}
                className="text-sm font-bold text-rose-600 hover:text-rose-700"
              >
                Cerrar todas
              </button>
            )}
          </div>

          {loadingSessions ? (
            <p className="text-sm text-muted-foreground text-center py-4">Cargando sesiones…</p>
          ) : sessions && sessions.length > 0 ? (
            <div className="space-y-3">
              {sessions.map((session) => (
                <div
                  key={session.idSession}
                  className="flex items-center justify-between p-3 bg-secondary rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <Activity size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">
                        {session.userAgent ?? 'Dispositivo desconocido'}
                        {session.isCurrent && <span className="ml-2 px-1.5 py-0.5 text-xs font-bold bg-primary text-primary-foreground rounded">Actual</span>}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {session.ipAddress ?? 'IP desconocida'} • {session.lastActivityAt ? new Date(session.lastActivityAt).toLocaleString('es-CO') : 'Actividad reciente'}
                      </p>
                    </div>
                  </div>
                  {!session.isCurrent && (
                    <button
                      type="button"
                      onClick={() => handleCloseSession(session.idSession)}
                      className="text-rose-600 hover:text-rose-700 text-sm font-bold"
                    >
                      Cerrar
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No hay sesiones activas</p>
          )}
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

      {/* Modals */}
      <ChangePasswordModal
        open={showChangePassword}
        onClose={() => setShowChangePassword(false)}
        onSubmit={handleChangePassword}
        loading={changePassword.isPending}
        error={cpError}
        currentValue={cpCurrent}
        onCurrentChange={setCpCurrent}
        newValue={cpNew}
        onNewChange={setCpNew}
        confirmValue={cpConfirm}
        onConfirmChange={setCpConfirm}
      />

      <ConfirmModal
        open={!!showCloseSessionConfirm}
        onClose={() => setShowCloseSessionConfirm(null)}
        title="Cerrar sesión"
        message="¿Cerrar esta sesión? Tendrás que iniciar sesión de nuevo en ese dispositivo."
        confirmLabel="Cerrar"
        onConfirm={confirmCloseSession}
        loading={closeSession.isPending}
        variant="danger"
      />

      <ConfirmModal
        open={showCloseAllConfirm}
        onClose={() => setShowCloseAllConfirm(false)}
        title="Cerrar todas las sesiones"
        message="Se cerrarán todas tus sesiones activas en todos los dispositivos, incluida la actual. Tendrás que iniciar sesión de nuevo."
        confirmLabel="Cerrar todas"
        onConfirm={confirmCloseAllSessions}
        loading={closeAllSessions.isPending}
        variant="danger"
      />
    </div>
  )
}

interface ChangePasswordModalProps {
  open: boolean
  onClose: () => void
  onSubmit: () => void
  loading: boolean
  error: string | null
  currentValue: string
  onCurrentChange: (v: string) => void
  newValue: string
  onNewChange: (v: string) => void
  confirmValue: string
  onConfirmChange: (v: string) => void
}

function ChangePasswordModal({ open, onClose, onSubmit, loading, error, currentValue, onCurrentChange, newValue, onNewChange, confirmValue, onConfirmChange }: ChangePasswordModalProps) {
  return (
    <FormModal
      open={open}
      onClose={onClose}
      title="Cambiar contraseña"
      ctaLabel="Guardar cambios"
      onSubmit={onSubmit}
      submitting={loading}
    >
      {error && (
        <p className="bg-rose-50 text-rose-700 border border-rose-100 rounded-xl p-3 text-sm mb-5">{error}</p>
      )}
      <p className="text-xs text-muted-foreground mb-5">Al cambiar la contraseña, se cerrarán todas tus sesiones y deberás iniciar sesión de nuevo.</p>
      <Field label="Contraseña actual">
        <input
          type="password"
          className={inputCls}
          placeholder="••••••••"
          value={currentValue}
          onChange={(e) => onCurrentChange(e.target.value)}
        />
      </Field>
      <Field label="Nueva contraseña">
        <input
          type="password"
          className={inputCls}
          placeholder="Mínimo 8 caracteres"
          value={newValue}
          onChange={(e) => onNewChange(e.target.value)}
        />
      </Field>
      <Field label="Confirmar nueva contraseña">
        <input
          type="password"
          className={inputCls}
          placeholder="••••••••"
          value={confirmValue}
          onChange={(e) => onConfirmChange(e.target.value)}
        />
      </Field>
    </FormModal>
  )
}

interface ConfirmModalProps {
  open: boolean
  onClose: () => void
  title: string
  message: string
  confirmLabel: string
  onConfirm: () => void
  loading: boolean
  variant?: 'danger' | 'primary'
}

function ConfirmModal({ open, onClose, title, message, confirmLabel, onConfirm, loading, variant = 'danger' }: ConfirmModalProps) {
  return (
    <FormModal
      open={open}
      onClose={onClose}
      title={title}
      ctaLabel={confirmLabel}
      onSubmit={onConfirm}
      submitting={loading}
    >
      <p className="text-sm text-muted-foreground mb-5">{message}</p>
      <div className="flex flex-col-reverse md:flex-row md:justify-end gap-2">
        <button type="button" onClick={onClose} className="w-full md:w-auto py-4 md:px-6 rounded-2xl font-bold text-sm text-muted-foreground bg-muted hover:bg-secondary transition-colors cursor-pointer">
          Cancelar
        </button>
        <PrimaryButton onClick={onConfirm} disabled={loading} className={variant === 'danger' ? 'bg-rose-600 hover:bg-rose-700' : ''}>
          {loading ? <Loader2 size={18} className="animate-spin" /> : null}
          {confirmLabel}
        </PrimaryButton>
      </div>
    </FormModal>
  )
}