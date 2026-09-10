import { useMemo, useState } from 'react'
import { Pause, Play, RotateCcw } from 'lucide-react'
import type { FoodCustomer, FoodProduct, RecurringOrder } from '../../../../core/domain/entities/food'
import { formatMoney } from '../../../../core/domain/value-objects/money'
import { RECURRING_DAY_LABELS } from '../../../../core/domain/entities/food'
import { Modal } from '../../../components/core/Modal'
import { Field } from '../../../components/core/Field'
import { SelectField } from '../../../components/core/SelectField'
import { inputCls } from '../../../components/core/input'
import { useCustomerPrices, useUpsertCustomerPrice } from '../../../hooks/useFoodQuery'
import { useResetOnOpen } from '../../../hooks/useResetOnOpen'

interface CustomerDetailModalProps {
  open: boolean
  onClose: () => void
  customer: FoodCustomer | null
  recurring?: RecurringOrder[]
  idBusiness?: string
  products: FoodProduct[]
  onConfigureRecurring?: (customer: FoodCustomer) => void
  onToggleRecurring?: (idRecurringOrder: string, active: boolean) => void
}

export function CustomerDetailModal({ open, onClose, customer, recurring, idBusiness, products, onConfigureRecurring, onToggleRecurring }: CustomerDetailModalProps) {
  const pricesQuery = useCustomerPrices(idBusiness, customer?.idCustomer)
  const customPrices = useMemo(
    () => pricesQuery.data ?? customer?.customPrices ?? [],
    [pricesQuery.data, customer?.customPrices]
  )

  const [productId, setProductId] = useState('')
  const [customPrice, setCustomPrice] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)

  const { mutate: upsertPrice, isPending } = useUpsertCustomerPrice(idBusiness, customer?.idCustomer)

  const initialProductId = products[0]?.idProduct ?? ''
  const [prevProductId, setPrevProductId] = useState(initialProductId)

  const customPriceMap = useMemo(
    () => new Map(customPrices.map((cp) => [cp.product.idProduct, cp.customPrice])),
    [customPrices]
  )

  useResetOnOpen(open, () => {
    setProductId(initialProductId)
    setPrevProductId(initialProductId)
    setCustomPrice('')
    setLocalError(null)
  })

  if (productId && productId !== prevProductId) {
    setPrevProductId(productId)
    const existing = customPriceMap.get(productId)
    const base = products.find((p) => p.idProduct === productId)?.basePrice
    setCustomPrice(existing !== undefined ? String(existing) : base !== undefined ? String(base) : '')
  }

  const handleSavePrice = () => {
    if (!customer) return
    const price = Number(customPrice)
    if (!productId || !Number.isFinite(price) || price <= 0) {
      setLocalError('Ingresa un precio válido mayor a cero')
      return
    }
    setLocalError(null)
    upsertPrice({ idProduct: productId, customPrice: price })
    setCustomPrice('')
  }

  if (!customer) return null

  const customerRecurring = recurring?.find((r) => (r.customer?.idCustomer ?? r.idCustomer) === customer.idCustomer)

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

          {customer.emailCustomer && (
            <div className="bg-secondary rounded-2xl p-4">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Email</p>
              <p className="text-sm text-foreground">{customer.emailCustomer}</p>
            </div>
          )}

          {customer.descriptionCustomer && (
            <div className="bg-secondary rounded-2xl p-4">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Descripción</p>
              <p className="text-sm text-foreground">{customer.descriptionCustomer}</p>
            </div>
          )}

          {customerRecurring && (
            <div className="bg-secondary rounded-2xl p-4">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Pedido recurrente</p>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                  customerRecurring.isActive
                    ? 'bg-violet-50 text-violet-700 border-violet-100'
                    : 'bg-muted text-muted-foreground border-border'
                }`}>
                  {customerRecurring.isActive ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              <p className="text-sm text-foreground">
                Cada {customerRecurring.recurringDays.map((d) => RECURRING_DAY_LABELS[d]).join(', ')} a las{' '}
                <span className="font-mono font-bold">{customerRecurring.deliveryTime}</span>
              </p>
              {customerRecurring.fixedItems.length > 0 && (
                <div className="mt-2 space-y-1">
                  {customerRecurring.fixedItems.map((item, i) => {
                    const itemName =
                      products.find((p) => p.idProduct === item.productId)?.nameProduct ??
                      item.productName ??
                      item.productId
                    const itemPrice = item.customPrice ?? customPriceMap.get(item.productId)
                    return (
                      <p key={i} className="text-xs text-muted-foreground">
                        {item.quantity} x {itemName}
                        {itemPrice ? ` · ${formatMoney(itemPrice)}` : ''}
                      </p>
                    )
                  })}
                </div>
              )}
              <p className="text-[11px] text-muted-foreground mt-2">
                Desde {new Date(customerRecurring.startDate).toLocaleDateString()} hasta{' '}
                {new Date(customerRecurring.endDate).toLocaleDateString()}
              </p>
              {onToggleRecurring && (
                <button
                  type="button"
                  onClick={() => onToggleRecurring(customerRecurring.idRecurringOrder, !customerRecurring.isActive)}
                  className={`mt-3 w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm border transition-all active:scale-[0.99] cursor-pointer ${
                    customerRecurring.isActive
                      ? 'bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-100'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100'
                  }`}
                >
                  {customerRecurring.isActive ? <Pause size={15} /> : <Play size={15} />}
                  {customerRecurring.isActive ? 'Pausar recurrencia' : 'Activar recurrencia'}
                </button>
              )}
            </div>
          )}

          {!customerRecurring && onConfigureRecurring && (
            <div className="bg-violet-50 border border-violet-100 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <RotateCcw size={15} className="text-violet-600 shrink-0" />
                <p className="text-xs font-bold text-violet-700">Pedido recurrente</p>
              </div>
              <p className="text-xs text-violet-600 mb-3">
                Configura los días, productos y hora en que el pedido se debe crear automáticamente.
              </p>
              <button
                type="button"
                onClick={() => onConfigureRecurring(customer)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm bg-violet-600 text-white hover:brightness-105 active:scale-[0.99] transition-all cursor-pointer"
              >
                <RotateCcw size={15} />
                Configurar recurrencia
              </button>
            </div>
          )}

          {customPrices.length > 0 && (
            <div className="bg-secondary rounded-2xl p-4">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Precios personalizados</p>
              <div className="space-y-2">
                {customPrices.map((cp) => (
                  <div key={cp.idCustomerProductPrice ?? cp.product.idProduct} className="flex justify-between items-center">
                    <div>
                      <span className="text-sm text-foreground">{cp.product?.nameProduct ?? cp.product.idProduct}</span>
                      {cp.product?.basePrice && (
                        <span className="text-xs text-muted-foreground ml-2">(base: {formatMoney(cp.product.basePrice)})</span>
                      )}
                    </div>
                    <span className="text-sm font-mono font-bold text-primary">{formatMoney(cp.customPrice)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {products.length > 0 && (
            <div className="bg-card border border-border rounded-2xl p-4">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Asignar precio personalizado</p>
              {localError && (
                <p className="bg-rose-50 text-rose-700 border border-rose-100 rounded-xl p-2 text-xs mb-3">{localError}</p>
              )}
              <Field label="Producto">
                <SelectField
                  placeholder="Seleccionar producto"
                  options={products.map((p) => ({ value: p.idProduct, label: p.nameProduct }))}
                  value={productId || undefined}
                  onChange={(val) => setProductId(val)}
                />
              </Field>
              <div className="flex items-center gap-2 mt-3">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    className={inputCls + ' pl-6'}
                    value={customPrice}
                    onChange={(e) => setCustomPrice(e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSavePrice}
                  disabled={isPending}
                  className="px-4 py-2.5 rounded-xl bg-accent text-accent-foreground font-bold text-sm hover:brightness-105 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
                >
                  Guardar
                </button>
              </div>
              <p className="text-[11px] text-muted-foreground mt-2">
                Este precio se aplicará automáticamente en las órdenes de este cliente.
              </p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}