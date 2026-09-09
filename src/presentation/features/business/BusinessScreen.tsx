import { useState } from 'react'
import { Building2 } from 'lucide-react'
import { BusinessTabs, type BusinessTab } from './BusinessTabs'
import { ParquederoSection } from './parking/ParquederoSection'
import { FoodSection } from './food/FoodSection'
import { useQuery } from '@tanstack/react-query'
import { getAccessToken } from '@/infrastructure/api/http-client'
import { ApiBusinessRepository } from '@/infrastructure/api/api-business.repository'
import { queryKeys } from '@/presentation/query/keys'
import type { Business } from '../../../core/domain/entities/business'

const businessRepository = new ApiBusinessRepository()

function useBusinesses() {
  return useQuery({
    queryKey: queryKeys.business.list,
    queryFn: () => businessRepository.list(),
    enabled: Boolean(getAccessToken()),
    staleTime: 60_000,
  })
}

export function BusinessScreen() {
  const [businessTab, setBusinessTab] = useState<BusinessTab>('parquedero')
  const { data: businesses } = useBusinesses()

  const parkingBusiness = businesses?.find((b: Business) => b.businessType === 'PARKING') ?? null
  const otherBusiness = businesses?.find((b: Business) => b.businessType !== 'PARKING') ?? null

  const currentBusiness = businessTab === 'parquedero' ? parkingBusiness : otherBusiness

  return (
    <div className="pb-6">
      <div className="px-5 pt-7 pb-4">
        <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Building2 size={22} className="text-primary" />
          Business
        </h1>
        <p className="text-muted-foreground text-sm mt-0.5">Gestión de parquedero y comida rápida</p>
      </div>

      <div className="mx-5 mb-5">
        <BusinessTabs value={businessTab} onChange={setBusinessTab} />
      </div>

      <div className="px-5">
        {businessTab === 'parquedero' ? (
          currentBusiness ? <ParquederoSection idBusiness={currentBusiness.idBusiness} /> : null
        ) : (
          <FoodSection idBusiness={currentBusiness?.idBusiness} />
        )}
      </div>
    </div>
  )
}