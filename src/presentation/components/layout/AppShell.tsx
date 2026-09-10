import { Outlet, useLocation } from 'react-router'
import { BottomNav } from './BottomNav'
import { Sidebar } from './Sidebar'
import { NAV } from '../../type/navigation/navigation'
import type { Tab } from '../../type/navigation/navigation'

export function AppShell() {
  const location = useLocation()
  const tab: Tab =
    NAV.find((item) => item.path === location.pathname)?.id ??
    (location.pathname === '/settings' ? 'settings' : 'dashboard')

  return (
    <div className="min-h-screen bg-background">
      <Sidebar tab={tab} />

      <main className="md:ml-64 pb-36 md:pb-0">
        <div className="max-w-md mx-auto md:max-w-2xl">
          <Outlet />
        </div>
      </main>

      <BottomNav tab={tab} />
    </div>
  )
}