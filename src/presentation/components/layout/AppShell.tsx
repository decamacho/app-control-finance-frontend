import { Outlet, useLocation } from 'react-router'
import { BottomNav } from './BottomNav'
import { Sidebar } from './Sidebar'
import { MobileTopbar } from './MobileTopbar'
import { NAV, type Tab } from '../../type/navigation/navigation'

export function AppShell() {
  const location = useLocation()
  const tab: Tab = NAV.find((item) => item.path === location.pathname)?.id ?? 'dashboard'

  return (
    <div className="min-h-screen bg-background">
      <Sidebar tab={tab} />

      <main className="md:ml-64 pb-28 md:pb-0">
        <MobileTopbar />
        <div className="max-w-md mx-auto md:max-w-2xl">
          <Outlet />
        </div>
      </main>

      <BottomNav tab={tab} />
    </div>
  )
}