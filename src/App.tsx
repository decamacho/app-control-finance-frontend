import { Navigate, Route, Routes } from 'react-router'
import { AppShell } from './presentation/components/layout/AppShell'
import { Placeholder } from './presentation/components/shared/Placeholder'
import { AuthGuard } from './presentation/features/auth/AuthGuard'
import { Login } from './presentation/features/auth/Login'
import { Register } from './presentation/features/auth/Register'
import { VerifyEmail } from './presentation/features/auth/VerifyEmail'
import { MiNegocioScreen } from './presentation/features/business/MiNegocioScreen'
import { SettingsScreen } from './presentation/features/settings/SettingsScreen'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email/:token" element={<VerifyEmail />} />

      <Route
        element={
          <AuthGuard>
            <AppShell />
          </AuthGuard>
        }
      >
        <Route path="/" element={<Placeholder label="Inicio" />} />
        <Route path="/wallets" element={<Placeholder label="Billeteras" />} />
        <Route path="/expenses" element={<Placeholder label="Gastos" />} />
        <Route path="/reminders" element={<Placeholder label="Avisos" />} />
        <Route path="/business" element={<MiNegocioScreen />} />
        <Route path="/settings" element={<SettingsScreen />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App