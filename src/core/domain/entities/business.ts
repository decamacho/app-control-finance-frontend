import type { BusinessType } from '../entities/api'

export interface Business {
  idBusiness: string
  nameBusiness: string
  businessType: BusinessType
}