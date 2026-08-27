import { Pencil, Trash2, Eye, MapPin, Phone } from 'lucide-react'
import type { FoodCustomer } from '../../../../core/domain/entities/food'

interface CustomerListProps {
  customers: FoodCustomer[]
  onEdit: (customer: FoodCustomer) => void
  onDelete: (customer: FoodCustomer) => void
  onViewDetail: (customer: FoodCustomer) => void
}

export function CustomerList({ customers, onEdit, onDelete, onViewDetail }: CustomerListProps) {
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
      {customers.map((customer) => (
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
              {customer.customPrices && customer.customPrices.length > 0 && (
                <span className="inline-flex mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-100">
                  {customer.customPrices.length} precio(s) custom
                </span>
              )}
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
      ))}
    </div>
  )
}
