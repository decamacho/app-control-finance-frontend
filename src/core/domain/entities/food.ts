import type { PaymentMethod, PaymentStatus } from './api'

export type { PaymentMethod, PaymentStatus } from './api'

export type DeliveryStatus = 'NOT_DELIVERED' | 'PARTIAL_DELIVERED' | 'DELIVERED'

export type RecurringDay = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN'

export interface FoodProduct {
  idProduct: string
  nameProduct: string
  basePrice: number
}

export interface FoodCustomer {
  idCustomer: string
  nameCustomer: string
  locationCustomer: string
  phoneCustomer: string
  emailCustomer: string | null
  descriptionCustomer: string | null
  customPrices?: CustomerProductPrice[]
}

export interface CustomerProductPrice {
  idCustomerProductPrice: string
  customPrice: number
  createdAt: string
  modifyAt: string
  product: FoodProduct
}

export type OrderType = 'SALE' | 'EXPENSE'

export interface OrderItem {
  idOrderItem: string
  idProduct: string
  nameProduct?: string
  quantity: number
  unitPrice: number
  subtotal: number
  product?: FoodProduct
}

export interface FoodOrder {
  idOrder: string
  idBusiness: string
  idCustomer?: string | null
  customer?: { idCustomer: string; nameCustomer: string; locationCustomer?: string; phoneCustomer?: string } | null
  orderType: OrderType
  description?: string | null
  deliveryTime: string
  totalAmount: number
  paidAmount: number
  pendingAmount: number
  paymentStatus: PaymentStatus
  deliveryStatus: DeliveryStatus
  statusOrder: 'ACTIVE' | 'CANCELLED'
  items: OrderItem[]
  payments: FoodPayment[]
  deliveries: FoodDelivery[]
  idRecurringOrder: string | null
  recurringOrder?: RecurringOrder | null
  hasRecurringOrder?: boolean
  createdAt?: string | null
  lastCreatedAt?: string | null
}

export interface FoodPayment {
  idPayment: string
  amount: number
  paymentMethod: PaymentMethod
  paymentDate?: string | null
  createdAt?: string
}

export interface FoodDelivery {
  idDelivery: string
  deliveredAt: string
  status: DeliveryStatus
  notes: string | null
  items: DeliveryItem[]
}

export interface DeliveryItem {
  idDeliveryItem: string
  quantity: number
  orderItem: OrderItem
}

export interface DeliverySummaryItem {
  idOrderItem: string
  productId: string
  productName: string
  orderedQuantity: number
  deliveredQuantity: number
  pendingQuantity: number
  fullyDelivered: boolean
}

export interface RecurringOrder {
  idRecurringOrder: string
  idCustomer: string
  customer: { idCustomer: string; nameCustomer: string }
  recurringDays: RecurringDay[]
  deliveryTime: string
  startDate: string
  endDate: string
  isActive: boolean
  fixedItems: RecurringFixedItem[]
  createdAt: string
  modifyAt: string
}

export interface RecurringFixedItem {
  productId: string
  productName?: string
  quantity: number
  customPrice?: number
}

export interface OrderFilters {
  status?: string
  paymentStatus?: string
  deliveryStatus?: string
  orderType?: OrderType
  date?: string
}

export interface CreateProductInput {
  nameProduct: string
  basePrice: number
}

export interface CreateCustomerInput {
  nameCustomer: string
  locationCustomer: string
  phoneCustomer: string
  emailCustomer?: string
  descriptionCustomer?: string
}

export interface CreateOrderInput {
  idBusiness: string
  idCustomer?: string
  deliveryTime: string
  items?: Array<{ idProduct: string; quantity: number }>
  orderType?: OrderType
  description?: string
  totalAmount?: number
  paymentMethod?: PaymentMethod
  isRecurring?: boolean
  recurringConfig?: {
    recurringDays: RecurringDay[]
    deliveryTime: string
    startDate: string
    endDate: string
  }
}

export interface DaySummary {
  date: string
  received: number
  cash: number
  otherPayment: number
  expenses: number
  net: number
  salesCount: number
  expensesCount: number
}

export interface DaySummaryCustomerItem {
  idProduct: string
  nameProduct: string
  quantity: number
}

export interface DaySummaryCustomer {
  idCustomer: string
  nameCustomer: string
  total: number
  paid: number
  owed: number
  paymentStatus: string
  paymentLabel: string
  deliveryStatus: string
  deliveryLabel: string
  items: DaySummaryCustomerItem[]
  pendingDeliveryItems: DaySummaryCustomerItem[]
}

export interface DaySummaryResponse {
  date: string
  summary: Omit<DaySummary, 'date'>
  customers: DaySummaryCustomer[]
}

export interface UpdateOrderInput {
  deliveryTime?: string
  items?: Array<{ idProduct: string; quantity: number }>
}

export interface RegisterOrderPaymentsInput {
  payments: Array<{ amount: number; paymentMethod: PaymentMethod }>
  paymentDate?: string | null
}

export interface CreateRecurringInput {
  idBusiness: string
  idCustomer: string
  recurringDays: RecurringDay[]
  deliveryTime: string
  startDate: string
  endDate: string
  fixedItems: Array<{ productId: string; quantity: number; customPrice?: number }>
}

export interface CreateDeliveryInput {
  items: Array<{ idOrderItem: string; quantity: number }>
  notes?: string
}

export interface CreateCustomerProductPriceInput {
  idProduct: string
  customPrice: number
}

export const ORDER_STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'Activo',
  CANCELLED: 'Cancelado',
}

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  PENDING: 'Pendiente',
  PARTIAL: 'Parcial',
  PAID: 'Pagado',
}

export const DELIVERY_STATUS_LABELS: Record<DeliveryStatus, string> = {
  NOT_DELIVERED: 'Sin entregar',
  PARTIAL_DELIVERED: 'Entrega parcial',
  DELIVERED: 'Entregado',
}

export const RECURRING_DAY_LABELS: Record<RecurringDay, string> = {
  MON: 'Lunes',
  TUE: 'Martes',
  WED: 'Miércoles',
  THU: 'Jueves',
  FRI: 'Viernes',
  SAT: 'Sábado',
  SUN: 'Domingo',
}
