import type { FoodRepository } from '../../core/ports/food.repository'
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
} from '../../core/domain/entities/food'
import { http } from './http-client'

function buildQueryParams(idBusiness: string, filters?: OrderFilters): string {
  const params = new URLSearchParams({ idBusiness })
  if (filters?.status) params.set('status', filters.status)
  if (filters?.paymentStatus) params.set('paymentStatus', filters.paymentStatus)
  if (filters?.deliveryStatus) params.set('deliveryStatus', filters.deliveryStatus)
  if (filters?.orderType) params.set('orderType', filters.orderType)
  const qs = params.toString()
  return qs ? `?${qs}` : ''
}

function toCustomerBody(input: CreateCustomerInput) {
  return {
    nameCustomer: input.nameCustomer,
    locationCustomer: input.locationCustomer,
    phoneCustomer: input.phoneCustomer,
    emailCustomer: input.emailCustomer,
    descriptionCustomer: input.descriptionCustomer,
  }
}

export class ApiFoodRepository implements FoodRepository {
  async listProducts(idBusiness: string): Promise<FoodProduct[]> {
    return http.get<FoodProduct[]>(`/businesses/${idBusiness}/products`)
  }

  async createProduct(idBusiness: string, input: CreateProductInput): Promise<FoodProduct> {
    return http.post<FoodProduct>(`/businesses/${idBusiness}/products`, input)
  }

  async updateProduct(idBusiness: string, id: string, input: CreateProductInput): Promise<FoodProduct> {
    return http.patch<FoodProduct>(`/businesses/${idBusiness}/products/${id}`, input)
  }

  async deleteProduct(idBusiness: string, id: string): Promise<void> {
    await http.delete<void>(`/businesses/${idBusiness}/products/${id}`)
  }

  async listCustomers(idBusiness: string): Promise<FoodCustomer[]> {
    return http.get<FoodCustomer[]>(`/businesses/${idBusiness}/customers`)
  }

  async createCustomer(idBusiness: string, input: CreateCustomerInput): Promise<FoodCustomer> {
    return http.post<FoodCustomer>(`/businesses/${idBusiness}/customers`, toCustomerBody(input))
  }

  async updateCustomer(idBusiness: string, id: string, input: CreateCustomerInput): Promise<FoodCustomer> {
    return http.patch<FoodCustomer>(`/businesses/${idBusiness}/customers/${id}`, toCustomerBody(input))
  }

  async deleteCustomer(idBusiness: string, id: string): Promise<void> {
    await http.delete<void>(`/businesses/${idBusiness}/customers/${id}`)
  }

  async listOrders(idBusiness: string, filters?: OrderFilters): Promise<FoodOrder[]> {
    return http.get<FoodOrder[]>(`/orders${buildQueryParams(idBusiness, filters)}`)
  }

  async getOrder(idOrder: string): Promise<FoodOrder> {
    return http.get<FoodOrder>(`/orders/${idOrder}`)
  }

  async createOrder(input: CreateOrderInput): Promise<FoodOrder> {
    return http.post<FoodOrder>('/orders', input)
  }

  async updateOrder(id: string, input: UpdateOrderInput): Promise<FoodOrder> {
    return http.patch<FoodOrder>(`/orders/${id}`, input)
  }

  async cancelOrder(id: string): Promise<FoodOrder> {
    return http.delete<FoodOrder>(`/orders/${id}`)
  }

  async getDailySummary(idBusiness: string): Promise<DaySummary> {
    return http.get<DaySummary>(`/orders/summary/${idBusiness}`)
  }

  async listOrderPayments(idOrder: string): Promise<FoodPayment[]> {
    return http.get<FoodPayment[]>(`/orders/${idOrder}/payments`)
  }

  async registerOrderPayments(idOrder: string, input: RegisterOrderPaymentsInput): Promise<{ payments: FoodPayment[]; order: { idOrder: string; paidAmount: number; pendingAmount: number; paymentStatus: string } }> {
    return http.post(`/orders/${idOrder}/payments`, input)
  }

  async createDelivery(idOrder: string, input: CreateDeliveryInput): Promise<FoodDelivery> {
    return http.post<FoodDelivery>(`/orders/${idOrder}/deliveries`, input)
  }

  async listDeliveries(idOrder: string): Promise<FoodDelivery[]> {
    return http.get<FoodDelivery[]>(`/orders/${idOrder}/deliveries`)
  }

  async getDeliverySummary(idOrder: string): Promise<{ idOrder: string; deliveryStatus: string; items: DeliverySummaryItem[] }> {
    return http.get(`/orders/${idOrder}/delivery-summary`)
  }

  async listCustomerPrices(idBusiness: string, idCustomer: string): Promise<CustomerProductPrice[]> {
    return http.get<CustomerProductPrice[]>(`/businesses/${idBusiness}/customers/${idCustomer}/product-prices`)
  }

  async upsertCustomerPrice(idBusiness: string, idCustomer: string, input: CreateCustomerProductPriceInput): Promise<CustomerProductPrice> {
    return http.post<CustomerProductPrice>(`/businesses/${idBusiness}/customers/${idCustomer}/product-prices`, input)
  }

  async listRecurringByBusiness(idBusiness: string): Promise<RecurringOrder[]> {
    return http.get<RecurringOrder[]>(`/orders/recurring/${idBusiness}`)
  }

  async createRecurring(input: CreateRecurringInput): Promise<RecurringOrder> {
    const deliveryTime = input.startDate
      ? new Date(`${input.startDate}T${input.deliveryTime || '12:00'}`).toISOString()
      : new Date().toISOString()

    return http.post<RecurringOrder>('/orders', {
      idBusiness: input.idBusiness,
      idCustomer: input.idCustomer,
      deliveryTime,
      items: input.fixedItems.map((fi) => ({
        idProduct: fi.productId,
        quantity: fi.quantity,
      })),
      isRecurring: true,
      recurringConfig: {
        recurringDays: input.recurringDays,
        deliveryTime: input.deliveryTime,
        startDate: input.startDate,
        endDate: input.endDate,
      },
    })
  }

  async toggleRecurring(idOrder: string, idRecurringOrder: string, active: boolean): Promise<RecurringOrder> {
    return http.patch<RecurringOrder>(`/orders/${idOrder}/recurring/${idRecurringOrder}/toggle`, { isActive: active })
  }
}