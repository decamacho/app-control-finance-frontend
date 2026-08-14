import { Navigate, Route, Routes } from 'react-router'
import { AppShell } from './presentation/components/layout/AppShell'
import { PlaceholderScreen } from './presentation/components/shared/PlaceholderScreen'
import { ForgotPasswordScreen } from './presentation/features/auth/ForgotPasswordScreen'
import { LoginScreen } from './presentation/features/auth/LoginScreen'
import { RegisterScreen } from './presentation/features/auth/RegisterScreen'
import { MiNegocioScreen } from './presentation/features/business/MiNegocioScreen'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginScreen onLogin={() => {}} />} />
      <Route path="/register" element={<RegisterScreen onRegister={() => {}} />} />
      <Route path="/forgot-password" element={<ForgotPasswordScreen onRequestReset={() => {}} onConfirmReset={() => {}} />} />

      <Route element={<AppShell />}>
        <Route path="/" element={<PlaceholderScreen label="Inicio" />} />
        <Route path="/wallets" element={<PlaceholderScreen label="Billeteras" />} />
        <Route path="/expenses" element={<PlaceholderScreen label="Gastos" />} />
        <Route path="/reminders" element={<PlaceholderScreen label="Avisos" />} />
        <Route path="/business" element={<MiNegocioScreen />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App