import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { Product } from '../../../../core/domain/entities/product'
import type { PaymentMethod } from '../../../../core/domain/entities/sale'
import { formatMoney } from '../../../../core/domain/value-objects/money'
import { PAYMENT_OPTIONS } from '../../../type/business/constants'
import { Field } from '../../../components/core/Field'
import { FormModal } from '../../../components/core/FormModal'
import { inputCls } from '../../../components/core/input'
import type { RegisterSaleInput } from '../../../../core/application/register-sale'

interface SaleModalProps {
  open: boolean
  onClose: () => void
  products: Product[]
  onSave: (input: RegisterSaleInput) => void
}

export function SaleModal({ open, onClose, onSave, products }: SaleModalProps) {
  const [productId, setProductId] = useState(products[0]?.id ?? '')
  const [quantity, setQuantity] = useState(1)
  const [payment, setPayment] = useState<PaymentMethod>('efectivo')
  const selectedProduct = products.find((p) => p.id === productId)
  const total = (selectedProduct?.price ?? 0) * quantity

  const handleSave = () => {
    if (!selectedProduct) return
    onSave({ productId, quantity, payment })
    setQuantity(1)
    onClose()
  }

  return (
    <FormModal open={open} onClose={onClose} title="Registrar venta" ctaLabel="Registrar venta" onSubmit={handleSave}>
      <Field label="Producto">
        <div className="relative">
          <select className={inputCls + ' appearance-none pr-8'} value={productId} onChange={(e) => setProductId(e.target.value)}>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} — {formatMoney(p.price)}
              </option>
            ))}
          </select>
          <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        </div>
      </Field>
      <Field label="Cantidad">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Disminuir cantidad"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-foreground font-bold text-lg hover:bg-secondary transition-colors cursor-pointer"
          >
            −
          </button>
          <span className="flex-1 text-center font-mono font-bold text-xl">{quantity}</span>
          <button
            type="button"
            aria-label="Aumentar cantidad"
            onClick={() => setQuantity((q) => q + 1)}
            className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg hover:brightness-105 transition-all cursor-pointer"
          >
            +
          </button>
        </div>
      </Field>
      <div className="bg-secondary rounded-2xl p-4 mb-5">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground font-medium">Total a cobrar</span>
          <span className="text-2xl font-mono font-bold text-foreground">{formatMoney(total)}</span>
        </div>
      </div>
      <Field label="Medio de pago">
        <div className="grid grid-cols-3 gap-2">
          {PAYMENT_OPTIONS.map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setPayment(id)}
              className={`py-3 px-2 rounded-2xl text-xs font-bold border-2 transition-all ${
                payment === id ? 'border-primary bg-secondary text-foreground' : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </Field>
    </FormModal>
  )
}
