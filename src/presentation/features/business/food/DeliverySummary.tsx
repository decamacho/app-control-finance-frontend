import { CheckCircle2 } from 'lucide-react'
import type { DeliverySummaryItem } from '../../../../core/domain/entities/food'
import { Modal } from '../../../components/core/Modal'

interface DeliverySummaryProps {
  open: boolean
  onClose: () => void
  items: DeliverySummaryItem[]
}

export function DeliverySummary({ open, onClose, items }: DeliverySummaryProps) {
  const totalDelivered = items.reduce((sum, i) => sum + i.deliveredQuantity, 0)
  const totalOrdered = items.reduce((sum, i) => sum + i.orderedQuantity, 0)

  return (
    <Modal open={open} onClose={onClose} title="Resumen de entrega">
      <div className="px-6 py-4 overflow-y-auto max-h-[70vh]">
        <div className="bg-secondary rounded-2xl p-4 mb-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Pedidos</p>
              <p className="text-lg font-mono font-bold text-foreground">{totalOrdered}</p>
            </div>
            <div className="border-x border-border">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Entregados</p>
              <p className="text-lg font-mono font-bold text-emerald-600">{totalDelivered}</p>
            </div>
            <div className="border-x border-border">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Pendientes</p>
              <p className="text-lg font-mono font-bold text-rose-600">{totalOrdered - totalDelivered}</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.idOrderItem} className="bg-card border border-border rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-foreground">{item.productName}</span>
                {item.fullyDelivered ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                    <CheckCircle2 size={10} /> Completo
                  </span>
                ) : (
                  <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-100">
                    Parcial
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${item.orderedQuantity > 0 ? (item.deliveredQuantity / item.orderedQuantity) * 100 : 0}%` }}
                    />
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-foreground shrink-0">
                  {item.deliveredQuantity}/{item.orderedQuantity}
                </span>
              </div>
              {item.pendingQuantity > 0 && (
                <p className="text-[10px] text-rose-500 mt-1">Faltan {item.pendingQuantity} unidades</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </Modal>
  )
}
