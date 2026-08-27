export const queryKeys = {
  auth: {
    all: ['auth'] as const,
    session: ['auth', 'session'] as const,
    sessions: ['auth', 'sessions'] as const,
    verify: (token: string) => ['auth', 'verify', token] as const,
  },
  business: {
    all: ['business'] as const,
    list: ['business', 'list'] as const,
  },
  parking: {
    all: ['parking'] as const,
    rates: (idBusiness: string) => ['parking', idBusiness, 'rates'] as const,
    vehicles: (idBusiness: string) => ['parking', idBusiness, 'vehicles'] as const,
    vehicleByPlate: (idBusiness: string, licensePlate: string) => ['parking', idBusiness, 'vehicles', licensePlate] as const,
    tickets: (idBusiness: string, filters?: { status?: string; licensePlate?: string }) =>
      ['parking', idBusiness, 'tickets', filters] as const,
    activeTickets: (idBusiness: string) => ['parking', idBusiness, 'actives'] as const,
    activeByPlate: (idBusiness: string, licensePlate: string) =>
      ['parking', idBusiness, 'actives', licensePlate] as const,
    ticket: (idTicket: string) => ['parking', 'tickets', idTicket] as const,
    payments: (idTicket: string) => ['parking', idTicket, 'payments'] as const,
    vehicleMonthly: (idVehicle?: string) => ['parking', 'monthly', idVehicle] as const,
  },
  store: {
    all: ['store'] as const,
    products: ['store', 'products'] as const,
    sales: ['store', 'sales'] as const,
  },
  food: {
    all: ['food'] as const,
    products: ['food', 'products'] as const,
    customers: ['food', 'customers'] as const,
    todayOrders: ['food', 'orders', 'today'] as const,
    recurring: ['food', 'recurring'] as const,
  },
}
