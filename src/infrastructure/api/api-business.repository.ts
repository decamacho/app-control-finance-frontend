import type { Business } from '../../core/domain/entities/business'
import type { BusinessRepository } from '../../core/ports/business.repository'
import { http } from './http-client'

export class ApiBusinessRepository implements BusinessRepository {
  async list(): Promise<Business[]> {
    return http.get<Business[]>('/businesses')
  }
}