import type {
  FoodProduct,
  FoodCustomer,
  FoodOrder,
  FoodPayment,
  RecurringOrder,
  CreateProductInput,
  CreateCustomerInput,
  CreateOrderInput,
  UpdateOrderInput,
  RegisterOrderPaymentsInput,
  CreateRecurringInput,
} from '../domain/entities/food'

export interface FoodRepository {
  listProducts(): Promise<FoodProduct[]>
  createProduct(input: CreateProductInput): Promise<FoodProduct>
  updateProduct(id: string, input: CreateProductInput): Promise<FoodProduct>
  deleteProduct(id: string): Promise<void>

  listCustomers(): Promise<FoodCustomer[]>
  createCustomer(input: CreateCustomerInput): Promise<FoodCustomer>
  updateCustomer(id: string, input: CreateCustomerInput): Promise<FoodCustomer>
  deleteCustomer(id: string): Promise<void>

  listTodayOrders(): Promise<FoodOrder[]>
  createOrder(input: CreateOrderInput): Promise<FoodOrder>
  updateOrder(id: string, input: UpdateOrderInput): Promise<FoodOrder>

  registerOrderPayments(idOrder: string, input: RegisterOrderPaymentsInput): Promise<{ payments: FoodPayment[]; order: { paidAmount: number; pendingAmount: number; paymentStatus: string } }>

  listRecurring(): Promise<RecurringOrder[]>
  createRecurring(input: CreateRecurringInput): Promise<RecurringOrder>
  toggleRecurring(id: string, active: boolean): Promise<RecurringOrder>
}
