import type { SaleRepository } from '../../core/ports/sale.repository'
import type { Product } from '../../core/domain/entities/product'
import type { Sale } from '../../core/domain/entities/sale'
import { http } from './http-client'

export class ApiSaleRepository implements SaleRepository {
  async listProducts(): Promise<Product[]> {
    return http.get<Product[]>('/products')
  }

  async listSales(): Promise<Sale[]> {
    return http.get<Sale[]>('/sales')
  }

  async saveSale(sale: Sale): Promise<void> {
    await http.post<void>('/sales', sale)
  }
}
