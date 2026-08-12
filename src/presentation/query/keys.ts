export const queryKeys = {
  parking: {
    all: ['parking'] as const,
    entries: ['parking', 'entries'] as const,
    entry: (id: string) => ['parking', 'entries', id] as const,
    vehicles: ['parking', 'vehicles'] as const,
  },
  store: {
    all: ['store'] as const,
    products: ['store', 'products'] as const,
    sales: ['store', 'sales'] as const,
  },
}
