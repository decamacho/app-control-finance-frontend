import type { ReactNode } from 'react'
import { AlertTriangle, X } from 'lucide-react'
import { Modal } from './Modal'

interface ConfirmModalProps {
  open: boolean
  title: string
  message: ReactNode
  confirmLabel: string
  cancelLabel?: string
  onCancel: () => void
  onConfirm: () => void
  loading?: boolean
}

export function ConfirmModal({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel = 'Cancelar',
  onCancel,
  onConfirm,
  loading = false,
}: ConfirmModalProps) {
  return (
    <Modal open={open} onClose={onCancel} title={title}>
      <div className="px-6 py-5">
        <div className="flex items-start gap-3 bg-rose-50 border border-rose-100 rounded-2xl p-4">
          <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
            <AlertTriangle size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-foreground">{message}</p>
            <p className="text-xs text-muted-foreground mt-1">Esta acción no se puede deshacer.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-5">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm bg-muted text-muted-foreground hover:bg-secondary transition-all cursor-pointer disabled:opacity-50"
          >
            <X size={16} />
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm bg-rose-600 text-white hover:brightness-105 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Procesando...' : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  )
}