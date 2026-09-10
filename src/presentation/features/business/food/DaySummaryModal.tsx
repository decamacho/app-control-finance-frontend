import { useState } from 'react'
import { Check, ClipboardCopy } from 'lucide-react'
import type { DaySummaryCustomerItem, DaySummaryResponse } from '../../../../core/domain/entities/food'
import { formatMoney } from '../../../../core/domain/value-objects/money'
import { Modal } from '../../../components/core/Modal'
import { PrimaryButton } from '../../../components/core/PrimaryButton'

interface DaySummaryModalProps {
  open: boolean
  onClose: () => void
  summary: DaySummaryResponse | null | undefined
}

function formatDate(value: string | undefined): string {
  if (!value) return ''
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [y, m, d] = value.split('-').map(Number)
    return new Date(y, m - 1, d).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })
  }
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })
}

function itemsText(items: DaySummaryCustomerItem[]): string {
  return items.map((item) => `${item.nameProduct} x${item.quantity}`).join(', ')
}

function buildSummaryText(summary: DaySummaryResponse | null | undefined): string {
  if (!summary) return ''

  const lines = [
    `Resumen del día · ${formatDate(summary.date)}`,
    '',
    `Recibido: ${formatMoney(summary.summary.received)}`,
    `Efectivo: ${formatMoney(summary.summary.cash)}`,
    `Otros medios de pago: ${formatMoney(summary.summary.otherPayment)}`,
    `Gastos: ${formatMoney(summary.summary.expenses)}`,
    `Total: ${formatMoney(summary.summary.net)}`,
    '',
    'Por usuario:',
  ]

  if (summary.customers.length === 0) {
    lines.push('Ninguno')
  } else {
    for (const customer of summary.customers) {
      const salesCount = summary.summary.salesCount ?? 0
      lines.push(`- ${customer.nameCustomer} · ${salesCount} ${salesCount === 1 ? 'venta' : 'ventas'}`)
      if (customer.paymentStatus === 'PAID') {
        if (customer.paid > customer.total) {
          lines.push(`  Pago: Pago superior a ${formatMoney(customer.total)} (pagado ${formatMoney(customer.paid)})`)
        } else {
          lines.push(`  Pago: Pago completo de ${formatMoney(customer.total)}`)
        }
      } else if (customer.paymentStatus === 'PARTIAL') {
        lines.push(`  Pago: Pagado ${formatMoney(customer.paid)} de ${formatMoney(customer.total)}`)
      } else {
        lines.push(`  Pago: Pendiente pago de ${formatMoney(customer.total)}`)
      }
      if (customer.pendingDeliveryItems.length > 0) {
        lines.push(`  Entrega: Pendiente entrega de ${itemsText(customer.pendingDeliveryItems)}`)
      } else {
        lines.push('  Entrega: Entregado')
      }
      const items = itemsText(customer.items)
      if (items) lines.push(`  Productos: ${items}`)
      lines.push('')
    }
  }

  return lines.join('\n').replace(/\n+$/, '')
}

export function DaySummaryModal({ open, onClose, summary }: DaySummaryModalProps) {
  const [copied, setCopied] = useState(false)

  const text = buildSummaryText(summary)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Resumen del día">
      <div className="px-6 py-4">
        <div className="bg-secondary rounded-2xl p-4 mb-4 max-h-[50vh] overflow-y-auto">
          <pre className="whitespace-pre-wrap font-mono text-sm text-foreground leading-relaxed">{text || 'Sin datos'}</pre>
        </div>

        <PrimaryButton onClick={handleCopy} disabled={!text || !summary}>
          {copied ? <Check size={18} /> : <ClipboardCopy size={18} />}
          {copied ? '¡Copiado!' : 'Copiar resumen'}
        </PrimaryButton>
      </div>
    </Modal>
  )
}