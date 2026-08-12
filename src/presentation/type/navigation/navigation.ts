import { Home, CreditCard, Receipt, Bell, Building2 } from "lucide-react";

export const NAV = [
  { id: "dashboard", label: "Inicio", Icon: Home },
  { id: "wallets", label: "Billeteras", Icon: CreditCard },
  { id: "expenses", label: "Gastos", Icon: Receipt },
  { id: "reminders", label: "Avisos", Icon: Bell },
  { id: "negocio", label: "Negocio", Icon: Building2 },
] as const;

export type Tab = (typeof NAV)[number]["id"];
