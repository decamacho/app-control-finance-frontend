import type {
  FoodProduct,
  FoodCustomer,
  FoodOrder,
  FoodPayment,
  FoodDelivery,
  DeliverySummaryItem,
  RecurringOrder,
  CustomerProductPrice,
  CreateProductInput,
  CreateCustomerInput,
  CreateOrderInput,
  UpdateOrderInput,
  RegisterOrderPaymentsInput,
  CreateRecurringInput,
  CreateDeliveryInput,
  CreateCustomerProductPriceInput,
  OrderFilters,
  DaySummary,
} from '../domain/entities/food'

export interface FoodRepository {
  listProducts(idBusiness: string): Promise<FoodProduct[]>
  createProduct(idBusiness: string, input: CreateProductInput): Promise<FoodProduct>
  updateProduct(idBusiness: string, id: string, input: CreateProductInput): Promise<FoodProduct>
  deleteProduct(idBusiness: string, id: string): Promise<void>

  listCustomers(idBusiness: string): Promise<FoodCustomer[]>
  createCustomer(idBusiness: string, input: CreateCustomerInput): Promise<FoodCustomer>
  updateCustomer(idBusiness: string, id: string, input: CreateCustomerInput): Promise<FoodCustomer>
  deleteCustomer(idBusiness: string, id: string): Promise<void>

  listOrders(idBusiness: string, filters?: OrderFilters): Promise<FoodOrder[]>
  getOrder(idOrder: string): Promise<FoodOrder>
  createOrder(input: CreateOrderInput): Promise<FoodOrder>
  updateOrder(id: string, input: UpdateOrderInput): Promise<FoodOrder>
  cancelOrder(id: string): Promise<FoodOrder>
  getDailySummary(idBusiness: string): Promise<DaySummary>

  listOrderPayments(idOrder: string): Promise<FoodPayment[]>
  registerOrderPayments(idOrder: string, input: RegisterOrderPaymentsInput): Promise<{ payments: FoodPayment[]; order: { idOrder: string; paidAmount: number; pendingAmount: number; paymentStatus: string } }>

  createDelivery(idOrder: string, input: CreateDeliveryInput): Promise<FoodDelivery>
  listDeliveries(idOrder: string): Promise<FoodDelivery[]>
  getDeliverySummary(idOrder: string): Promise<{ idOrder: string; deliveryStatus: string; items: DeliverySummaryItem[] }>

  listCustomerPrices(idBusiness: string, idCustomer: string): Promise<CustomerProductPrice[]>
  upsertCustomerPrice(idBusiness: string, idCustomer: string, input: CreateCustomerProductPriceInput): Promise<CustomerProductPrice>

  listRecurringByBusiness(idBusiness: string): Promise<RecurringOrder[]>
  createRecurring(input: CreateRecurringInput): Promise<RecurringOrder>
  toggleRecurring(idOrder: string, idRecurringOrder: string, active: boolean): Promise<RecurringOrder>
}
