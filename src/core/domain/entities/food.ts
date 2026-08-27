import type { PaymentMethod, PaymentStatus } from './api'

export type OrderStatus = 'PENDING' | 'PREPARING' | 'DELIVERED' | 'CANCELLED'

export type RecurringFrequency = 'DAILY' | 'WEEKDAYS' | 'WEEKLY' | 'MONTHLY'

export interface FoodProduct {
  idProduct: string
  nameProduct: string
  basePrice: number
}

export interface ProductCustomPrice {
  idProduct: string
  customPrice: number
}

export interface FoodCustomer {
  idCustomer: string
  nameCustomer: string
  locationCustomer: string
  phoneCustomer: string
  email: string
  description: string
  customPrices: ProductCustomPrice[]
}

export interface OrderItem {
  idProduct: string
  nameProduct?: string
  quantity: number
  unitPrice?: number
}

export interface FoodOrder {
  idOrder: string
  idCustomer: string
  customerName: string
  deliveryTime: string
  notes: string
  items: OrderItem[]
  totalAmount: number
  paidAmount: number
  pendingAmount: number
  paymentStatus: PaymentStatus
  status: OrderStatus
  isRecurring: boolean
}

export interface FoodPayment {
  idPayment: string
  amount: number
  paymentMethod: PaymentMethod
}

export interface RecurringOrder {
  idRecurring: string
  idCustomer: string
  customerName: string
  frequency: RecurringFrequency
  items: OrderItem[]
  active: boolean
}

export interface CreateProductInput {
  nameProduct: string
  basePrice: number
}

export interface CreateCustomerInput {
  nameCustomer: string
  locationCustomer: string
  phoneCustomer: string
  email: string
  description: string
  customPrices?: ProductCustomPrice[]
}

export interface CreateOrderInput {
  idCustomer: string
  deliveryTime: string
  notes: string
  items: Array<{ idProduct: string; quantity: number; unitPrice?: number }>
}

export interface UpdateOrderInput {
  status?: OrderStatus
  notes?: string
  items?: Array<{ idProduct: string; quantity: number; unitPrice?: number }>
}

export interface RegisterOrderPaymentsInput {
  payments: Array<{ amount: number; paymentMethod: PaymentMethod }>
}

export interface CreateRecurringInput {
  idCustomer: string
  frequency: RecurringFrequency
  items: Array<{ idProduct: string; quantity: number; unitPrice?: number }>
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: 'Pendiente',
  PREPARING: 'En preparación',
  DELIVERED: 'Entregada',
  CANCELLED: 'Cancelada',
}

export const RECURRING_FREQUENCY_LABELS: Record<RecurringFrequency, string> = {
  DAILY: 'Todos los días',
  WEEKDAYS: 'Lunes a viernes',
  WEEKLY: 'Semanal',
  MONTHLY: 'Mensual',
}
