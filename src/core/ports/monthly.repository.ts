import type { ActivateMonthlyInput, ActivateMonthlyResponse, CancelMonthlyResponse } from '../domain/entities/parking'

export interface MonthlyRepository {
  activateMonthly(idTicket: string, input?: ActivateMonthlyInput): Promise<ActivateMonthlyResponse>
  cancelMonthly(idTicket: string): Promise<CancelMonthlyResponse>
}
