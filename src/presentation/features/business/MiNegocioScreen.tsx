import { useState } from 'react'
import { Building2 } from 'lucide-react'
import { PARKING_RATES, type ParkingRates } from '../../../core/domain/services/parking'
import { BusinessTabs, type BusinessTab } from './BusinessTabs'
import { ParquederoSection } from './parking/ParquederoSection'
import { TiendaSection } from './store/TiendaSection'

export function MiNegocioScreen() {
  const [businessTab, setBusinessTab] = useState<BusinessTab>('parquedero')
  const [parkingRates, setParkingRates] = useState<ParkingRates>(PARKING_RATES)

  return (
    <div className="pb-6">
      <div className="px-5 pt-7 pb-4">
        <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Building2 size={22} className="text-primary" />
          Mi Negocio
        </h1>
        <p className="text-muted-foreground text-sm mt-0.5">Gestión de parquedero y tienda</p>
      </div>

      <div className="mx-5 mb-5">
        <BusinessTabs value={businessTab} onChange={setBusinessTab} />
      </div>

      <div className="px-5">
        {businessTab === 'parquedero' ? (
          <ParquederoSection parkingRates={parkingRates} onUpdateRates={setParkingRates} />
        ) : (
          <TiendaSection />
        )}
      </div>
    </div>
  )
}
