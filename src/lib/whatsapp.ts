import type { OrderItem } from '../hooks/useOrder'

export type CheckoutInfo = {
  businessName: string
  contactName: string
  phone: string
  deliveryAddress?: string
  notes?: string
}

export function buildWhatsAppMessage(params: {
  checkout: CheckoutInfo
  items: OrderItem[]
  locationLabel: string
}) {
  const { checkout, items, locationLabel } = params

  const lines: string[] = []
  lines.push('*Pedido - Carnicos Gustavo*')
  lines.push(`CEDIS: ${locationLabel}`)
  lines.push('')
  lines.push(`Negocio: ${checkout.businessName}`)
  lines.push(`Contacto: ${checkout.contactName}`)
  lines.push(`Tel: ${checkout.phone}`)
  if (checkout.deliveryAddress?.trim()) lines.push(`Entrega: ${checkout.deliveryAddress.trim()}`)
  if (checkout.notes?.trim()) lines.push(`Notas: ${checkout.notes.trim()}`)
  lines.push('')
  lines.push('*Productos:*')
  for (const item of items) {
    lines.push(`  ${item.quantity} x ${item.name}`)
  }
  lines.push('')
  lines.push(`Total: ${items.reduce((a, x) => a + x.quantity, 0)} piezas`)
  lines.push('')
  lines.push('_Enviado desde pedidos.carnicosgustavo.com_')

  return lines.join('\n')
}

export function buildWhatsAppUrl(phoneE164: string, message: string) {
  const phone = phoneE164.replace(/[^\d]/g, '')
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}
