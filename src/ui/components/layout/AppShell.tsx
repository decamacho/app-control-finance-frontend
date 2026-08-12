import { useState } from 'react'
import { Sidebar } from './Sidebar'
import { BottomNav } from './BottomNav'
import { NAV, type Tab } from '../../type/layout/navigation'

export function AppShell() {
  const [tab, setTab] = useState<Tab>('dashboard')
  const active = NAV.find((item) => item.id === tab)

  return (
    <div className="min-h-screen bg-background">
      <Sidebar tab={tab} onTabChange={setTab} />

      <main className="md:ml-64 pb-24 md:pb-0">
        <div className="max-w-md mx-auto md:max-w-2xl">
          <header className="px-5 pt-7 pb-4">
            <h1 className="text-xl font-bold text-foreground">{active?.label}</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Pantalla en construcción</p>
          </header>
        </div>
      </main>

      <BottomNav tab={tab} onTabChange={setTab} />
    </div>
  )
}
