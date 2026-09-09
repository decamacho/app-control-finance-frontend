import { Pencil, Trash2, Eye, MapPin, Phone, RotateCcw, RefreshCw } from 'lucide-react'
import type { FoodCustomer, RecurringOrder } from '../../../../core/domain/entities/food'
import { RECURRING_DAY_LABELS } from '../../../../core/domain/entities/food'

interface CustomerListProps {
  customers: FoodCustomer[]
  recurring?: RecurringOrder[]
  onEdit: (customer: FoodCustomer) => void
  onDelete: (customer: FoodCustomer) => void
  onViewDetail: (customer: FoodCustomer) => void
  onManageRecurring?: (customer: FoodCustomer) => void
}

export function CustomerList({ customers, recurring, onEdit, onDelete, onViewDetail, onManageRecurring }: CustomerListProps) {
  if (customers.length === 0) {
    return (
      <div className="bg-card border border-border rounded-2xl p-8 text-center">
        <p className="text-sm font-bold text-foreground">Sin clientes</p>
        <p className="text-xs text-muted-foreground mt-1">Registra tu primer cliente para comenzar</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {customers.map((customer) => {
        const customerRecurring = recurring?.find((r) => r.idCustomer === customer.idCustomer)
        return (
        <div key={customer.idCustomer} className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-foreground truncate">{customer.nameCustomer}</p>
              {customer.locationCustomer && (
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <MapPin size={10} /> {customer.locationCustomer}
                </p>
              )}
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                <Phone size={10} /> {customer.phoneCustomer}
              </p>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {customer.customPrices && customer.customPrices.length > 0 && (
                  <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-100">
                    {customer.customPrices.length} precio(s) custom
                  </span>
                )}
                {customerRecurring ? (
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    customerRecurring.isActive
                      ? 'bg-violet-50 text-violet-700 border-violet-100'
                      : 'bg-muted text-muted-foreground border-border'
                  }`}>
                    <RefreshCw size={10} />
                    {customerRecurring.isActive
                      ? `Recurrente · ${customerRecurring.recurringDays.map((d) => RECURRING_DAY_LABELS[d].slice(0, 3)).join(', ')} ${customerRecurring.deliveryTime}`
                      : 'Recurrente inactivo'}
                  </span>
                ) : (
                  <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-muted text-muted-foreground border border-border">
                    Sin recurrencia
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-0.5 shrink-0">
              <button
                type="button"
                aria-label={`Ver ${customer.nameCustomer}`}
                onClick={() => onViewDetail(customer)}
                className="p-2 text-muted-foreground hover:text-primary hover:bg-secondary rounded-xl transition-colors cursor-pointer"
              >
                <Eye size={14} />
              </button>
              {onManageRecurring && (
                <button
                  type="button"
                  aria-label={`Gestionar recurrencia de ${customer.nameCustomer}`}
                  onClick={() => onManageRecurring(customer)}
                  className="p-2 text-muted-foreground hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-colors cursor-pointer"
                >
                  <RotateCcw size={14} />
                </button>
              )}
              <button
                type="button"
                aria-label={`Editar ${customer.nameCustomer}`}
                onClick={() => onEdit(customer)}
                className="p-2 text-muted-foreground hover:text-primary hover:bg-secondary rounded-xl transition-colors cursor-pointer"
              >
                <Pencil size={14} />
              </button>
              <button
                type="button"
                aria-label={`Eliminar ${customer.nameCustomer}`}
                onClick={() => onDelete(customer)}
                className="p-2 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        </div>
        )
      })}
    </div>
  )
}
