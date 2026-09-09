import { Banknote, CreditCard, Smartphone, Tag } from 'lucide-react'
import type { Product } from '../../../../core/domain/entities/product'
import type { PaymentMethod, Sale } from '../../../../core/domain/entities/sale'
import { formatMoney } from '../../../../core/domain/value-objects/money'

export function ProductRow({ product }: { product: Product }) {
  return (
    <div className="flex items-center gap-3 bg-card border border-border rounded-2xl p-3.5">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-violet-50">
        <Tag size={15} className="text-violet-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-foreground">{product.name}</p>
        <p className="text-xs text-muted-foreground">
          {product.category} · stock:{' '}
          <span className={`font-bold ${product.stock < 15 ? 'text-amber-600' : 'text-emerald-600'}`}>{product.stock}</span>
        </p>
      </div>
      <p className="font-mono font-bold text-foreground text-sm flex-shrink-0">{formatMoney(product.price)}</p>
    </div>
  )
}

const PAYMENT_ICONS: Record<PaymentMethod, typeof Banknote> = {
  efectivo: Banknote,
  nequi: Smartphone,
  tarjeta: CreditCard,
}

export function SaleRow({ sale }: { sale: Sale }) {
  const Icon = PAYMENT_ICONS[sale.payment]
  return (
    <div className="flex items-center gap-3 py-3">
      <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center flex-shrink-0 text-muted-foreground">
        <Icon size={15} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-foreground truncate">{sale.productName}</p>
        <p className="text-xs text-muted-foreground">
          {sale.time} · x{sale.quantity}
        </p>
      </div>
      <p className="text-sm font-mono font-bold text-emerald-600 flex-shrink-0">+{formatMoney(sale.total)}</p>
    </div>
  )
}
