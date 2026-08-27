import type { FoodCustomer } from '../../../../core/domain/entities/food'
import { formatMoney } from '../../../../core/domain/value-objects/money'
import { Modal } from '../../../components/core/Modal'

interface CustomerDetailModalProps {
  open: boolean
  onClose: () => void
  customer: FoodCustomer | null
}

export function CustomerDetailModal({ open, onClose, customer }: CustomerDetailModalProps) {
  if (!customer) return null

  return (
    <Modal open={open} onClose={onClose} title={customer.nameCustomer}>
      <div className="px-6 py-4 overflow-y-auto max-h-[70vh]">
        <div className="space-y-4">
          <div className="bg-secondary rounded-2xl p-4">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Ubicación</p>
            <p className="text-sm text-foreground">{customer.locationCustomer || 'Sin ubicación'}</p>
          </div>

          <div className="bg-secondary rounded-2xl p-4">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Teléfono</p>
            <p className="text-sm text-foreground font-mono">{customer.phoneCustomer}</p>
          </div>

          {customer.email && (
            <div className="bg-secondary rounded-2xl p-4">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Email</p>
              <p className="text-sm text-foreground">{customer.email}</p>
            </div>
          )}

          {customer.description && (
            <div className="bg-secondary rounded-2xl p-4">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Descripción</p>
              <p className="text-sm text-foreground">{customer.description}</p>
            </div>
          )}

          {customer.customPrices && customer.customPrices.length > 0 && (
            <div className="bg-secondary rounded-2xl p-4">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Precios personalizados</p>
              <div className="space-y-2">
                {customer.customPrices.map((cp) => (
                  <div key={cp.idProduct} className="flex justify-between items-center">
                    <span className="text-sm text-foreground">{cp.idProduct}</span>
                    <span className="text-sm font-mono font-bold text-primary">{formatMoney(cp.customPrice)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}
