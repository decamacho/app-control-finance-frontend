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
      {children}
      <div className="flex flex-col-reverse md:flex-row md:justify-end md:items-center gap-2">
        <button
          type="button"
          onClick={onClose}
          className="w-full md:w-auto py-4 md:px-6 rounded-2xl font-bold text-sm text-muted-foreground bg-muted hover:bg-secondary transition-colors cursor-pointer"
        >
          Cancelar
        </button>
        <PrimaryButton onClick={onSubmit} disabled={submitting} className="md:w-auto md:px-6">
          {ctaLabel}
        </PrimaryButton>
      </div>
    </Modal>
  )
}
