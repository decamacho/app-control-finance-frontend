import type { Payment, RegisterPaymentsInput } from '../domain/entities/parking'

export interface PaymentRepository {
  registerPayments(idTicket: string, input: RegisterPaymentsInput): Promise<{ payments: Payment[]; ticket: { pendingAmount: number } }>
  listPayments(idTicket: string): Promise<Payment[]>
}