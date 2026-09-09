import type { Product } from '../domain/entities/product'
import type { Sale } from '../domain/entities/sale'

export interface SaleRepository {
  listProducts(): Promise<Product[]>
  listSales(): Promise<Sale[]>
  saveSale(sale: Sale): Promise<void>
}
