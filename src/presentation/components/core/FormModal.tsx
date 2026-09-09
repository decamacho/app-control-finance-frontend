import type { ReactNode } from 'react'
import { Modal } from './Modal'
import { PrimaryButton } from './PrimaryButton'

interface FormModalProps {
  open: boolean
  onClose: () => void
  title: string
  ctaLabel: string
  onSubmit: () => void
  submitting?: boolean
  children: ReactNode
}

export function FormModal({ open, onClose, title, ctaLabel, onSubmit, submitting, children }: FormModalProps) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className="flex flex-col flex-1 min-h-0">
        <div className="flex-1 overflow-y-auto px-6 py-4 min-h-0">
          {children}
        </div>
        <div className="shrink-0 px-6 py-4 bg-card border-t border-border flex flex-col-reverse md:flex-row md:justify-end md:items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full md:w-auto py-4 md:px-6 rounded-2xl font-bold text-sm text-foreground bg-muted hover:bg-secondary transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <PrimaryButton onClick={onSubmit} disabled={submitting} className="md:w-auto md:px-6">
            {ctaLabel}
          </PrimaryButton>
        </div>
      </div>
    </Modal>
  )
}
