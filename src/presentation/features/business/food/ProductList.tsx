import { Pencil, Trash2 } from 'lucide-react'
import type { FoodProduct } from '../../../../core/domain/entities/food'
import { formatMoney } from '../../../../core/domain/value-objects/money'

interface ProductListProps {
  products: FoodProduct[]
  onEdit: (product: FoodProduct) => void
  onDelete: (product: FoodProduct) => void
}

export function ProductList({ products, onEdit, onDelete }: ProductListProps) {
  if (products.length === 0) {
    return (
      <div className="bg-card border border-border rounded-2xl p-8 text-center">
        <p className="text-sm font-bold text-foreground">Sin productos</p>
        <p className="text-xs text-muted-foreground mt-1">Crea tu primer producto para comenzar</p>
      </div>
    )
  }

  return (
    <div className="bg-card rounded-2xl border border-border px-4 divide-y divide-border">
      {products.map((product) => (
        <div key={product.idProduct} className="flex items-center gap-3 py-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-foreground truncate">{product.nameProduct}</p>
            <p className="text-xs font-mono text-muted-foreground">{formatMoney(product.basePrice)}</p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              aria-label={`Editar ${product.nameProduct}`}
              onClick={() => onEdit(product)}
              className="p-2 text-muted-foreground hover:text-primary hover:bg-secondary rounded-xl transition-colors cursor-pointer"
            >
              <Pencil size={14} />
            </button>
            <button
              type="button"
              aria-label={`Eliminar ${product.nameProduct}`}
              onClick={() => onDelete(product)}
              className="p-2 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
