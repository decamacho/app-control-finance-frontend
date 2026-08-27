import { useMemo, useState } from 'react'
import { BarChart3, Package, Plus, Users, UtensilsCrossed } from 'lucide-react'
import type { FoodOrder, FoodProduct, FoodCustomer } from '../../../../core/domain/entities/food'
import { formatMoney } from '../../../../core/domain/value-objects/money'
import {
  useFoodProducts,
  useFoodCustomers,
  useTodayFoodOrders,
  useFoodRecurring,
  useCreateFoodProduct,
  useUpdateFoodProduct,
  useDeleteFoodProduct,
  useCreateFoodCustomer,
  useUpdateFoodCustomer,
  useDeleteFoodCustomer,
  useCreateFoodOrder,
  useUpdateFoodOrder,
  useCreateRecurring,
  useToggleRecurring,
} from '../../../hooks/useFoodQuery'
import { PrimaryButton } from '../../../components/core/PrimaryButton'
import { FoodTabs, type FoodTab } from './FoodTabs'
import { OrderList } from './OrderList'
import { ProductList } from './ProductList'
import { CustomerList } from './CustomerList'
import { RecurringList } from './RecurringList'
import { ProductModal } from './ProductModal'
import { CustomerModal } from './CustomerModal'
import { OrderModal } from './OrderModal'
import { OrderEditModal } from './OrderEditModal'
import { RecurringModal } from './RecurringModal'
import { CustomerDetailModal } from './CustomerDetailModal'
import { FoodPaymentsModal } from './FoodPaymentsModal'

const EMPTY_ORDERS: FoodOrder[] = []
const EMPTY_PRODUCTS: FoodProduct[] = []
const EMPTY_CUSTOMERS: FoodCustomer[] = []

export function FoodSection() {
  const [activeTab, setActiveTab] = useState<FoodTab>('pedidos')

  const productsQuery = useFoodProducts()
  const customersQuery = useFoodCustomers()
  const ordersQuery = useTodayFoodOrders()
  const recurringQuery = useFoodRecurring()

  const createProduct = useCreateFoodProduct()
  const updateProduct = useUpdateFoodProduct()
  const deleteProduct = useDeleteFoodProduct()
  const createCustomer = useCreateFoodCustomer()
  const updateCustomer = useUpdateFoodCustomer()
  const deleteCustomer = useDeleteFoodCustomer()
  const createOrder = useCreateFoodOrder()
  const updateOrder = useUpdateFoodOrder()
  const toggleRecurring = useToggleRecurring()
  const createRecurring = useCreateRecurring()

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
  const [editOrder, setEditOrder] = useState<FoodOrder | null>(null)
  const [showRecurringModal, setShowRecurringModal] = useState(false)
  const [showPayments, setShowPayments] = useState<{ idOrder: string; totalAmount: number; pendingAmount: number } | null>(null)

  const stats = useMemo(() => {
    const todayRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0)
    const activeRecurring = recurring.filter((r) => r.active).length
    return { todayRevenue, ordersCount: orders.length, activeRecurring }
  }, [orders, recurring])

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
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Órdenes de hoy</p>
            <p className="text-2xl font-mono font-bold text-foreground mt-1">{formatMoney(stats.todayRevenue)}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'var(--gradient-brand)' }}>
            <UtensilsCrossed size={22} className="text-white" />
          </div>
        </div>
        <div className="flex gap-4 pt-3 border-t border-border">
          <div>
            <p className="text-xs text-muted-foreground">Órdenes</p>
            <p className="text-sm font-mono font-bold">{stats.ordersCount}</p>
          </div>
          <div className="w-px bg-border" />
          <div>
            <p className="text-xs text-muted-foreground">Recurrentes</p>
            <p className="text-sm font-mono font-bold">{stats.activeRecurring}</p>
          </div>
          <div className="w-px bg-border" />
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
          className="flex items-center justify-center gap-2 flex-1 px-6 bg-accent text-accent-foreground rounded-2xl font-bold text-sm hover:brightness-105 active:scale-[0.99] transition-all cursor-pointer"
        >
          <Plus size={18} />
          Nueva orden
        </button>
        <button
          type="button"
          onClick={() => setShowProductModal(true)}
          className="flex items-center gap-3 flex-1 bg-card border border-border rounded-2xl p-4 text-left active:scale-[0.99] transition-all hover:border-primary/50 hover:shadow-sm cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-primary flex-shrink-0">
            <Package size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-foreground">Productos</p>
            <p className="text-xs text-muted-foreground">{products.length} registrados</p>
          </div>
        </button>
        <button
          type="button"
          onClick={() => setShowCustomerModal(true)}
          className="flex items-center gap-3 flex-1 bg-card border border-border rounded-2xl p-4 text-left active:scale-[0.99] transition-all hover:border-primary/50 hover:shadow-sm cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-primary flex-shrink-0">
            <Users size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-foreground">Clientes</p>
            <p className="text-xs text-muted-foreground">{customers.length} registrados</p>
          </div>
        </button>
      </div>

      <div className="mb-5">
        <FoodTabs value={activeTab} onChange={setActiveTab} />
      </div>

      <div className="mb-5">
        {activeTab === 'pedidos' && (
          <>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <BarChart3 size={14} className="text-primary" />
                Pedidos de hoy
              </p>
              <span className="text-xs font-bold text-muted-foreground">{orders.length}</span>
            </div>
            <OrderList orders={orders} products={products} onEdit={(o) => setEditOrder(o)} />
          </>
        )}

        {activeTab === 'productos' && (
          <>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <Package size={14} className="text-primary" />
                Productos
              </p>
              <button
                type="button"
                onClick={() => setShowProductModal(true)}
                className="text-xs font-bold text-primary hover:underline cursor-pointer"
              >
                + Nuevo
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
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <Users size={14} className="text-primary" />
                Clientes
              </p>
              <button
                type="button"
                onClick={() => setShowCustomerModal(true)}
                className="text-xs font-bold text-primary hover:underline cursor-pointer"
              >
                + Nuevo
              </button>
            </div>
            <CustomerList
              customers={customers}
              onEdit={(c) => setEditCustomer(c)}
              onDelete={(c) => {
                if (confirm(`Eliminar "${c.nameCustomer}"?`)) deleteCustomer.mutate(c.idCustomer)
              }}
              onViewDetail={(c) => setDetailCustomer(c)}
            />
          </>
        )}

        {activeTab === 'recurrentes' && (
          <>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <BarChart3 size={14} className="text-primary" />
                Pedidos recurrentes
              </p>
              <button
                type="button"
                onClick={() => setShowRecurringModal(true)}
                className="text-xs font-bold text-primary hover:underline cursor-pointer"
              >
                + Nuevo
              </button>
            </div>
            <RecurringList
              recurring={recurring}
              products={products}
              onToggle={(id, active) => toggleRecurring.mutate({ id, active })}
            />
          </>
        )}
      </div>

      <div className="sticky bottom-24 md:bottom-4 -mx-5 px-5 pt-3 bg-background/95 backdrop-blur-sm md:hidden">
        <PrimaryButton onClick={() => setShowOrderModal(true)}>
          <Plus size={18} />
          Nueva orden
        </PrimaryButton>
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
        onSave={(input) => { createCustomer.mutate(input); setShowCustomerModal(false) }}
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
        onSave={(input) => { createOrder.mutate(input); setShowOrderModal(false) }}
      />
      <OrderEditModal
        open={!!editOrder}
        onClose={() => setEditOrder(null)}
        order={editOrder}
        products={products}
        onSave={(id, input) => { updateOrder.mutate({ id, input }); setEditOrder(null) }}
        onPay={(order) => {
          setEditOrder(null)
          setShowPayments({ idOrder: order.idOrder, totalAmount: order.totalAmount, pendingAmount: order.pendingAmount })
        }}
      />
      <FoodPaymentsModal
        open={!!showPayments}
        onClose={() => setShowPayments(null)}
        idOrder={showPayments?.idOrder ?? ''}
        totalAmount={showPayments?.totalAmount ?? 0}
        pendingAmount={showPayments?.pendingAmount ?? 0}
      />
      <RecurringModal
        open={showRecurringModal}
        onClose={() => setShowRecurringModal(false)}
        products={products}
        customers={customers}
        onSave={(input) => { createRecurring.mutate(input); setShowRecurringModal(false) }}
      />
      <CustomerDetailModal
        open={!!detailCustomer}
        onClose={() => setDetailCustomer(null)}
        customer={detailCustomer}
      />
    </div>
  )
}
