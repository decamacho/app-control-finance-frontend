import { useMemo, useState } from 'react'
import { Bar, BarChart, ResponsiveContainer, XAxis } from 'recharts'
import { Package, Plus, Receipt, ShoppingCart } from 'lucide-react'
import type { Sale } from '../../../../core/domain/entities/sale'
import { useStoreProducts, useStoreSales, useRegisterSale } from '../../../hooks/useStoreQuery'
import { formatMoney } from '../../../../core/domain/value-objects/money'
import { HOURLY_SALES_DATA } from '../../../type/business/constants'
import { PrimaryButton } from '../../../components/core/PrimaryButton'
import { ProductRow, SaleRow } from './rows'
import { SaleModal } from './SaleModal'

const EMPTY_SALES: Sale[] = []

export function TiendaSection() {
  const productsQuery = useStoreProducts()
  const salesQuery = useStoreSales()
  const registerSale = useRegisterSale()
  const [showModal, setShowModal] = useState(false)

  const products = productsQuery.data ?? []
  const sales = salesQuery.data ?? EMPTY_SALES

  const storeStats = useMemo(() => {
    const todayRevenue = sales.reduce((sum, sale) => sum + sale.total, 0)
    return {
      todayRevenue,
      transactions: sales.length,
      average: sales.length > 0 ? Math.round(todayRevenue / sales.length) : 0,
    }
  }, [sales])

  return (
    <div>
      {productsQuery.isError && (
        <p className="text-xs text-rose-600 bg-rose-50 border border-rose-100 rounded-2xl px-4 py-3 mb-5">
          No se pudo conectar con el servidor. Verifica que la API esté disponible.
        </p>
      )}

      <div className="bg-card border border-border rounded-2xl p-4 mb-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Ventas de hoy</p>
            <p className="text-2xl font-mono font-bold text-foreground mt-1">{formatMoney(storeStats.todayRevenue)}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'var(--gradient-violeta)' }}>
            <ShoppingCart size={22} className="text-white" />
          </div>
        </div>
        <div className="h-20">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={HOURLY_SALES_DATA} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <XAxis dataKey="hour" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
              <Bar dataKey="amount" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex gap-4 pt-3 border-t border-border">
          <div>
            <p className="text-xs text-muted-foreground">Transacciones</p>
            <p className="text-sm font-mono font-bold">{storeStats.transactions}</p>
          </div>
          <div className="w-px bg-border" />
          <div>
            <p className="text-xs text-muted-foreground">Promedio</p>
            <p className="text-sm font-mono font-bold">{formatMoney(storeStats.average)}</p>
          </div>
        </div>
      </div>

      <div className="hidden md:flex justify-end mb-5">
        <PrimaryButton className="md:w-auto md:px-6" onClick={() => setShowModal(true)}>
          <Plus size={18} />
          Registrar venta
        </PrimaryButton>
      </div>

      <div className="mb-5">
        <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-1.5">
          <Package size={14} className="text-primary" />
          Inventario
        </h3>
        <div className="space-y-2">
          {products.map((product) => (
            <ProductRow key={product.id} product={product} />
          ))}
        </div>
      </div>

      <div className="mb-5">
        <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-1.5">
          <Receipt size={14} className="text-primary" />
          Ventas recientes
        </h3>
        <div className="bg-card rounded-2xl border border-border px-4 divide-y divide-border">
          {sales.slice(0, 6).map((sale) => (
            <SaleRow key={sale.id} sale={sale} />
          ))}
        </div>
      </div>

      <div className="sticky bottom-24 md:bottom-4 -mx-5 px-5 pt-3 bg-background/95 backdrop-blur-sm md:hidden">
        <PrimaryButton onClick={() => setShowModal(true)}>
          <Plus size={18} />
          Registrar venta
        </PrimaryButton>
      </div>

      <SaleModal
        open={showModal}
        onClose={() => setShowModal(false)}
        products={products}
        onSave={(input) => {
          registerSale.mutate(input)
          setShowModal(false)
        }}
      />
    </div>
  )
}
