import { useState } from 'react'
import { Plus, UtensilsCrossed, ReceiptText } from 'lucide-react'
import type { FoodOrder, FoodProduct, FoodCustomer, OrderFilters } from '../../../../core/domain/entities/food'
import { formatMoney } from '../../../../core/domain/value-objects/money'
import {
  useFoodProducts,
  useFoodCustomers,
  useFoodOrders,
  useFoodRecurringByBusiness,
  useDailySummary,
  useCreateFoodProduct,
  useUpdateFoodProduct,
  useDeleteFoodProduct,
  useCreateFoodCustomer,
  useUpdateFoodCustomer,
  useDeleteFoodCustomer,
  useCreateFoodOrder,
  useCancelFoodOrder,
  useCreateRecurring,
  useToggleRecurring,
} from '../../../hooks/useFoodQuery'
import { ConfirmModal } from '../../../components/core/ConfirmModal'
import { FoodTabs, type FoodTab } from './FoodTabs'
import { OrderList } from './OrderList'
import { ProductList } from './ProductList'
import { CustomerList } from './CustomerList'
import { ProductModal } from './ProductModal'
import { CustomerModal } from './CustomerModal'
import { OrderModal } from './OrderModal'
import { OrderEditModal } from './OrderEditModal'
import { DeliveryModal } from './DeliveryModal'
import { RecurringModal } from './RecurringModal'
import { CustomerDetailModal } from './CustomerDetailModal'
import { FoodPaymentsModal } from './FoodPaymentsModal'
import { OrderFiltersBar } from './OrderFilters'
import { OrderDetailModal } from './OrderDetailModal'
import { ExpenseModal } from './ExpenseModal'

const EMPTY_ORDERS: FoodOrder[] = []
const EMPTY_PRODUCTS: FoodProduct[] = []
const EMPTY_CUSTOMERS: FoodCustomer[] = []

interface FoodSectionProps {
  idBusiness?: string
}

export function FoodSection({ idBusiness }: FoodSectionProps) {
  const [activeTab, setActiveTab] = useState<FoodTab>('pedidos')
  const [orderFilters, setOrderFilters] = useState<OrderFilters>({})

  const productsQuery = useFoodProducts(idBusiness)
  const customersQuery = useFoodCustomers(idBusiness)
  const ordersQuery = useFoodOrders(
    idBusiness,
    activeTab === 'pedidos' ? orderFilters : undefined
  )
  const recurringQuery = useFoodRecurringByBusiness(idBusiness)
  const summaryQuery = useDailySummary(idBusiness)

  const createProduct = useCreateFoodProduct(idBusiness)
  const updateProduct = useUpdateFoodProduct(idBusiness)
  const deleteProduct = useDeleteFoodProduct(idBusiness)
  const createCustomer = useCreateFoodCustomer(idBusiness)
  const updateCustomer = useUpdateFoodCustomer(idBusiness)
  const deleteCustomer = useDeleteFoodCustomer(idBusiness)
  const createOrder = useCreateFoodOrder()
  const cancelOrder = useCancelFoodOrder()
  const createRecurring = useCreateRecurring()
  const toggleRecurring = useToggleRecurring()

  const products = productsQuery.data ?? EMPTY_PRODUCTS
  const customers = customersQuery.data ?? EMPTY_CUSTOMERS
  const orders = ordersQuery.data ?? EMPTY_ORDERS
  const recurring = recurringQuery.data ?? []

  const [showProductModal, setShowProductModal] = useState(false)
  const [editProduct, setEditProduct] = useState<FoodProduct | null>(null)
  const [showCustomerModal, setShowCustomerModal] = useState(false)
  const [editCustomer, setEditCustomer] = useState<FoodCustomer | null>(null)
  const [detailCustomer, setDetailCustomer] = useState<FoodCustomer | null>(null)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [showExpenseModal, setShowExpenseModal] = useState(false)
  const [detailOrder, setDetailOrder] = useState<FoodOrder | null>(null)
  const [editOrder, setEditOrder] = useState<FoodOrder | null>(null)
  const [registerDelivery, setRegisterDelivery] = useState<FoodOrder | null>(null)
  const [showPayments, setShowPayments] = useState<{ idOrder: string; totalAmount: number; pendingAmount: number } | null>(null)
  const [cancelTarget, setCancelTarget] = useState<FoodOrder | null>(null)
  const [recurringCustomer, setRecurringCustomer] = useState<FoodCustomer | null>(null)

  const summary = summaryQuery.data

  return (
    <div>
      {(productsQuery.isError || ordersQuery.isError) && (
        <p className="text-xs text-rose-600 bg-rose-50 border border-rose-100 rounded-2xl px-4 py-3 mb-5">
          No se pudo conectar con el servidor. Verifica que la API esté disponible.
        </p>
      )}

      <div className="bg-card border border-border rounded-2xl p-4 mb-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Saldo del día</p>
            <p className="text-2xl font-mono font-bold text-foreground mt-1">{formatMoney(summary?.net ?? 0)}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'var(--gradient-brand)' }}>
            <UtensilsCrossed size={22} className="text-white" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
          <div>
            <p className="text-xs text-muted-foreground">Recibido</p>
            <p className="text-sm font-mono font-bold text-emerald-600">{summary ? formatMoney(summary.received) : '—'}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Gastos</p>
            <p className="text-sm font-mono font-bold text-rose-600">{summary ? formatMoney(summary.expenses) : '—'}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Clientes</p>
            <p className="text-sm font-mono font-bold">{customers.length}</p>
          </div>
        </div>
      </div>

      <div className="hidden md:flex gap-2 mb-5">
        <button
          type="button"
          onClick={() => setShowOrderModal(true)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-4 bg-accent text-accent-foreground rounded-2xl font-bold text-sm hover:brightness-105 active:scale-[0.99] transition-all cursor-pointer"
        >
          <Plus size={18} />
          Nuevo pedido
        </button>
        <button
          type="button"
          onClick={() => setShowExpenseModal(true)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-4 bg-rose-50 text-rose-700 border border-rose-100 rounded-2xl font-bold text-sm hover:bg-rose-100 active:scale-[0.99] transition-all cursor-pointer"
        >
          <ReceiptText size={18} />
          Nuevo gasto
        </button>
      </div>

      <div className="mb-5">
        <FoodTabs value={activeTab} onChange={setActiveTab} />
      </div>

      <div className="mb-5">
        {activeTab === 'pedidos' && (
          <OrderFiltersBar filters={orderFilters} onChange={setOrderFilters} />
        )}
      </div>

      <div className="mb-5">
        {activeTab === 'pedidos' && (
          <OrderList
            orders={orders}
            onViewDetail={(o) => setDetailOrder(o)}
          />
        )}

        {activeTab === 'productos' && (
          <>
            <div className="flex justify-end mb-3">
              <button
                type="button"
                onClick={() => setShowProductModal(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-accent text-accent-foreground rounded-2xl font-bold text-sm hover:brightness-105 active:scale-[0.99] transition-all cursor-pointer"
              >
                <Plus size={16} />
                Nuevo
              </button>
            </div>
            <ProductList
              products={products}
              onEdit={(p) => setEditProduct(p)}
              onDelete={(p) => {
                if (confirm(`Eliminar "${p.nameProduct}"?`)) deleteProduct.mutate(p.idProduct)
              }}
            />
          </>
        )}

        {activeTab === 'clientes' && (
          <>
            <div className="flex justify-end mb-3">
              <button
                type="button"
                onClick={() => setShowCustomerModal(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-accent text-accent-foreground rounded-2xl font-bold text-sm hover:brightness-105 active:scale-[0.99] transition-all cursor-pointer"
              >
                <Plus size={16} />
                Nuevo
              </button>
            </div>
            <CustomerList
              customers={customers}
              recurring={recurring}
              onEdit={(c) => setEditCustomer(c)}
              onDelete={(c) => {
                if (confirm(`Eliminar "${c.nameCustomer}"?`)) deleteCustomer.mutate(c.idCustomer)
              }}
              onViewDetail={(c) => setDetailCustomer(c)}
              onManageRecurring={(c) => {
                const has = recurring.some((r) => r.idCustomer === c.idCustomer)
                if (has) setDetailCustomer(c)
                else setRecurringCustomer(c)
              }}
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 sticky bottom-24 md:bottom-4 -mx-5 px-5 pt-3 pb-2 bg-background border-t border-border shadow-[0_-8px_16px_-8px_rgba(0,0,0,0.06)] md:hidden">
        <button
          type="button"
          onClick={() => setShowOrderModal(true)}
          className="flex items-center justify-center gap-2 py-4 bg-accent text-accent-foreground rounded-2xl font-bold text-sm hover:brightness-105 active:scale-[0.99] transition-all cursor-pointer"
        >
          <Plus size={18} />
          Pedido
        </button>
        <button
          type="button"
          onClick={() => setShowExpenseModal(true)}
          className="flex items-center justify-center gap-2 py-4 bg-rose-50 text-rose-700 border border-rose-100 rounded-2xl font-bold text-sm hover:bg-rose-100 active:scale-[0.99] transition-all cursor-pointer"
        >
          <ReceiptText size={18} />
          Gasto
        </button>
      </div>

      <ProductModal
        open={showProductModal}
        onClose={() => setShowProductModal(false)}
        onSave={(input) => { createProduct.mutate(input); setShowProductModal(false) }}
      />
      <ProductModal
        open={!!editProduct}
        onClose={() => setEditProduct(null)}
        initial={editProduct}
        onSave={(input) => { if (editProduct) updateProduct.mutate({ id: editProduct.idProduct, input }); setEditProduct(null) }}
      />
      <CustomerModal
        open={showCustomerModal}
        onClose={() => setShowCustomerModal(false)}
        products={products}
        onSave={(input) => {
          createCustomer.mutate(input, {
            onSuccess: (created) => {
              setShowCustomerModal(false)
              setDetailCustomer(created)
            },
          })
        }}
      />
      <CustomerModal
        open={!!editCustomer}
        onClose={() => setEditCustomer(null)}
        initial={editCustomer}
        products={products}
        onSave={(input) => { if (editCustomer) updateCustomer.mutate({ id: editCustomer.idCustomer, input }); setEditCustomer(null) }}
      />
      <OrderModal
        open={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        products={products}
        customers={customers}
        idBusiness={idBusiness}
        onSave={(input) => { createOrder.mutate(input); setShowOrderModal(false) }}
      />
      <OrderDetailModal
        open={!!detailOrder}
        onClose={() => setDetailOrder(null)}
        order={detailOrder}
        onPay={(order) => {
          setDetailOrder(null)
          setShowPayments({ idOrder: order.idOrder, totalAmount: order.totalAmount, pendingAmount: order.pendingAmount })
        }}
        onCancel={(id) => setCancelTarget(orders.find((o) => o.idOrder === id) ?? null)}
        onRegisterDelivery={(order) => {
          setDetailOrder(null)
          setRegisterDelivery(order)
        }}
        onEdit={(order) => {
          setDetailOrder(null)
          setEditOrder(order)
        }}
      />
      <OrderEditModal
        open={!!editOrder}
        onClose={() => setEditOrder(null)}
        order={editOrder}
        products={products}
        customer={customers.find((c) => c.idCustomer === editOrder?.idCustomer) ?? null}
      />
      <ExpenseModal
        open={showExpenseModal}
        onClose={() => setShowExpenseModal(false)}
        idBusiness={idBusiness}
        onSave={(input) => { createOrder.mutate(input); setShowExpenseModal(false) }}
      />
      <DeliveryModal
        open={!!registerDelivery}
        onClose={() => setRegisterDelivery(null)}
        order={registerDelivery}
      />
      <FoodPaymentsModal
        open={!!showPayments}
        onClose={() => setShowPayments(null)}
        idOrder={showPayments?.idOrder ?? ''}
        totalAmount={showPayments?.totalAmount ?? 0}
        pendingAmount={showPayments?.pendingAmount ?? 0}
      />
      <RecurringModal
        open={!!recurringCustomer}
        onClose={() => setRecurringCustomer(null)}
        products={products}
        customers={recurringCustomer ? [recurringCustomer] : []}
        existingRecurring={recurring.filter((r) => r.idCustomer === recurringCustomer?.idCustomer)}
        idBusiness={idBusiness}
        onSave={(input) => { createRecurring.mutate(input); setRecurringCustomer(null) }}
      />
      <CustomerDetailModal
        open={!!detailCustomer}
        onClose={() => setDetailCustomer(null)}
        customer={detailCustomer}
        recurring={recurring}
        idBusiness={idBusiness}
        products={products}
        onConfigureRecurring={(c) => {
          setDetailCustomer(null)
          setRecurringCustomer(c)
        }}
        onToggleRecurring={(idRecurringOrder, active) =>
          toggleRecurring.mutate({ idOrder: idRecurringOrder, idRecurringOrder, active })
        }
      />
      <ConfirmModal
        open={!!cancelTarget}
        onCancel={() => setCancelTarget(null)}
        onConfirm={() => {
          if (cancelTarget) cancelOrder.mutate(cancelTarget.idOrder)
          setCancelTarget(null)
          setDetailOrder(null)
        }}
        title="Cancelar pedido"
        message={
          <>
            ¿Estás seguro de cancelar el pedido de{' '}
            <span className="font-bold">{cancelTarget?.customer?.nameCustomer ?? 'este cliente'}</span> por{' '}
            <span className="font-bold font-mono">{cancelTarget ? formatMoney(cancelTarget.totalAmount) : ''}</span>?
          </>
        }
        confirmLabel="Si, cancelar"
      />
    </div>
  )
}
