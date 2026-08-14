import { Home, CreditCard, Receipt, Bell, Building2 } from "lucide-react";

export const NAV = [
  { id: "dashboard", label: "Inicio", path: "/", Icon: Home },
  { id: "wallets", label: "Billeteras", path: "/wallets", Icon: CreditCard },
  { id: "expenses", label: "Gastos", path: "/expenses", Icon: Receipt },
  { id: "reminders", label: "Avisos", path: "/reminders", Icon: Bell },
  { id: "negocio", label: "Negocio", path: "/business", Icon: Building2 },
] as const;

export type Tab = (typeof NAV)[number]["id"];
