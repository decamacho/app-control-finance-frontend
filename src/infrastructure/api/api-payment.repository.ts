import type { Payment, RegisterPaymentsInput } from '../../core/domain/entities/parking'
import type { PaymentRepository } from '../../core/ports/payment.repository'
import { http } from './http-client'

export class ApiPaymentRepository implements PaymentRepository {
  async registerPayments(idTicket: string, input: RegisterPaymentsInput): Promise<{ payments: Payment[]; ticket: { pendingAmount: number } }> {
    return http.post<{ payments: Payment[]; ticket: { pendingAmount: number } }>(`/parking-tickets/${idTicket}/payments`, input)
  }

  async listPayments(idTicket: string): Promise<Payment[]> {
    return http.get<Payment[]>(`/parking-tickets/${idTicket}/payments`)
  }
}