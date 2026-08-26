import type { Business } from '../domain/entities/business'

export interface BusinessRepository {
  list(): Promise<Business[]>
}