import type { ActivateMonthlyInput, ActivateMonthlyResponse, CancelMonthlyResponse } from '../../core/domain/entities/parking'
import type { MonthlyRepository } from '../../core/ports/monthly.repository'
import { http } from './http-client'

export class ApiMonthlyRepository implements MonthlyRepository {
  async activateMonthly(idTicket: string, input?: ActivateMonthlyInput): Promise<ActivateMonthlyResponse> {
    return http.post<ActivateMonthlyResponse>(`/parking-tickets/${idTicket}/monthly`, input ?? {})
  }

  async cancelMonthly(idTicket: string): Promise<CancelMonthlyResponse> {
    return http.post<CancelMonthlyResponse>(`/parking-tickets/${idTicket}/monthly/cancel`)
  }
}
