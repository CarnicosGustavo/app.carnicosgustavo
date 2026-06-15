import type { OrderItem } from '../hooks/useOrder'

/** Pedido anterior del cliente, tal como lo devuelve /api/last-order. */
export type Recognized = {
  businessName: string
  contactName: string
  deliveryAddress: string
  items: OrderItem[]
}

/** Reconoce al cliente por teléfono usando el endpoint server-side existente.
 *  Devuelve su último pedido o null. No lanza: ante error devuelve null. */
export async function lookupLastOrder(phone: string): Promise<Recognized | null> {
  const digits = phone.replace(/[^\d]/g, '')
  if (digits.length < 7) return null
  try {
    const resp = await fetch(`/api/last-order?phone=${encodeURIComponent(digits)}`)
    const data = (await resp.json()) as {
      found?: boolean
      order?: {
        businessName: string
        contactName: string
        deliveryAddress: string
        items: { productId: string; name: string; quantity: number; unit?: string }[]
      }
    }
    if (!data.found || !data.order) return null
    return {
      businessName: data.order.businessName,
      contactName: data.order.contactName,
      deliveryAddress: data.order.deliveryAddress,
      items: data.order.items.map((it) => ({
        productId: it.productId,
        name: it.name,
        quantity: it.quantity,
        unit: it.unit === 'kg' ? 'kg' : 'piezas',
      })),
    }
  } catch {
    return null
  }
}
