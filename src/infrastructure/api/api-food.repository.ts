import type { FoodRepository } from '../../core/ports/food.repository'
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
} from '../../core/domain/entities/food'
import { http } from './http-client'

export class ApiFoodRepository implements FoodRepository {
  async listProducts(): Promise<FoodProduct[]> {
    return http.get<FoodProduct[]>('/products')
  }

  async createProduct(input: CreateProductInput): Promise<FoodProduct> {
    return http.post<FoodProduct>('/products', input)
  }

  async updateProduct(id: string, input: CreateProductInput): Promise<FoodProduct> {
    return http.patch<FoodProduct>(`/products/${id}`, input)
  }

  async deleteProduct(id: string): Promise<void> {
    await http.delete<void>(`/products/${id}`)
  }

  async listCustomers(): Promise<FoodCustomer[]> {
    return http.get<FoodCustomer[]>('/customers')
  }

  async createCustomer(input: CreateCustomerInput): Promise<FoodCustomer> {
    return http.post<FoodCustomer>('/customers', input)
  }

  async updateCustomer(id: string, input: CreateCustomerInput): Promise<FoodCustomer> {
    return http.patch<FoodCustomer>(`/customers/${id}`, input)
  }

  async deleteCustomer(id: string): Promise<void> {
    await http.delete<void>(`/customers/${id}`)
  }

  async listTodayOrders(): Promise<FoodOrder[]> {
    return http.get<FoodOrder[]>('/orders/today')
  }

  async createOrder(input: CreateOrderInput): Promise<FoodOrder> {
    return http.post<FoodOrder>('/orders', input)
  }

  async updateOrder(id: string, input: UpdateOrderInput): Promise<FoodOrder> {
    return http.patch<FoodOrder>(`/orders/${id}`, input)
  }

  async registerOrderPayments(idOrder: string, input: RegisterOrderPaymentsInput): Promise<{ payments: FoodPayment[]; order: { paidAmount: number; pendingAmount: number; paymentStatus: string } }> {
    return http.post(`/orders/${idOrder}/payments`, input)
  }

  async listRecurring(): Promise<RecurringOrder[]> {
    return http.get<RecurringOrder[]>('/recurring')
  }

  async createRecurring(input: CreateRecurringInput): Promise<RecurringOrder> {
    return http.post<RecurringOrder>('/recurring', input)
  }

  async toggleRecurring(id: string, active: boolean): Promise<RecurringOrder> {
    return http.patch<RecurringOrder>(`/recurring/${id}`, { active })
  }
}
