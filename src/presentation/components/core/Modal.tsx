import type { ReactNode } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  return (
    <div
      className={`fixed inset-0 z-(--z-modal) flex items-end md:items-center justify-center transition-opacity duration-150 ${
        open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] cursor-pointer" onClick={onClose} />
      <div
        className={`relative w-full max-w-md md:max-w-lg bg-card rounded-t-3xl md:rounded-3xl shadow-2xl overflow-hidden transition-transform duration-150 ${
          open ? 'translate-y-0' : 'translate-y-12 md:translate-y-2'
        }`}
      >
        <div className="md:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-muted rounded-full" />
        </div>
        <div className="flex items-center justify-between px-6 pt-4 pb-4">
          <h2 className="text-lg font-bold text-foreground">{title}</h2>
          <button
            type="button"
            aria-label="Cerrar"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-secondary transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        <div className="px-6 pb-8 overflow-y-auto max-h-[80vh]">{children}</div>
      </div>
    </div>
  )
}
