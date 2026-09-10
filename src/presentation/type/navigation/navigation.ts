import { Home, CreditCard, Receipt, Bell, Building2, User } from "lucide-react";

export const NAV = [
  { id: "dashboard", label: "Inicio", path: "/", Icon: Home },
  { id: "wallets", label: "Billeteras", path: "/wallets", Icon: CreditCard },
  { id: "expenses", label: "Gastos", path: "/expenses", Icon: Receipt },
  { id: "reminders", label: "Avisos", path: "/reminders", Icon: Bell },
  { id: "negocio", label: "Negocio", path: "/business", Icon: Building2 },
] as const;

export const MOBILE_NAV = [
  { id: "negocio", label: "Negocio", path: "/business", Icon: Building2 },
  { id: "settings", label: "Usuario", path: "/settings", Icon: User },
] as const;

export type Tab = (typeof NAV)[number]["id"] | "settings";