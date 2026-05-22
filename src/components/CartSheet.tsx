import { useEffect, useRef, useState } from 'react'

import { BUSINESS, CONTACT } from '../config'
import type { OrderItem } from '../hooks/useOrder'
import { buildWhatsAppMessage, buildWhatsAppUrl } from '../lib/whatsapp'

type SaveState = 'idle' | 'saving' | 'success' | 'error'

type Props = {
  open: boolean
  items: OrderItem[]
  onClose: () => void
  onIncrement: (id: string) => void
  onDecrement: (id: string) => void
  onRemove: (id: string) => void
  onClear: () => void
}

const CUSTOMER_STORAGE_KEY = 'cg_pedido_customer_v1'

function loadCustomer() {
  try {
    const raw = localStorage.getItem(CUSTOMER_STORAGE_KEY)
    if (!raw) return { businessName: '', contactName: '', phone: '', deliveryAddress: '', notes: '' }
    return JSON.parse(raw) as {
      businessName: string
      contactName: string
      phone: string
      deliveryAddress: string
      notes: string
    }
  } catch {
    return { businessName: '', contactName: '', phone: '', deliveryAddress: '', notes: '' }
  }
}

export function CartSheet({ open, items, onClose, onIncrement, onDecrement, onRemove, onClear }: Props) {
  const customer = useRef(loadCustomer())
  const [businessName, setBusinessName] = useState(customer.current.businessName)
  const [contactName, setContactName] = useState(customer.current.contactName)
  const [phone, setPhone] = useState(customer.current.phone)
  const [deliveryAddress, setDeliveryAddress] = useState(customer.current.deliveryAddress)
  const [notes, setNotes] = useState(customer.current.notes)
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const [saveError, setSaveError] = useState('')

  // Guardar datos del cliente en localStorage
  useEffect(() => {
    localStorage.setItem(
      CUSTOMER_STORAGE_KEY,
      JSON.stringify({ businessName, contactName, phone, deliveryAddress, notes }),
    )
  }, [businessName, contactName, phone, deliveryAddress, notes])

  // Prevenir scroll del body cuando el sheet esta abierto
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (!open) return null

  const totalItems = items.reduce((a, x) => a + x.quantity, 0)
  const missing: string[] = []
  if (!businessName.trim()) missing.push('Negocio')
  if (!contactName.trim()) missing.push('Contacto')
  if (!phone.trim()) missing.push('Telefono')
  const formValid = missing.length === 0 && items.length > 0

  const hasWhatsApp =
    CONTACT.whatsappPhoneE164.replace(/[^\d]/g, '').length >= 11

  async function handleSave() {
    if (!formValid) return
    setSaveState('saving')
    setSaveError('')
    try {
      const resp = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName,
          contactName,
          phone,
          deliveryAddress,
          notes,
          locationLabel: BUSINESS.locationLabel,
          items,
        }),
      })
      if (!resp.ok) {
        const data = (await resp.json().catch(() => ({}))) as { error?: string }
        throw new Error(data.error || `HTTP ${resp.status}`)
      }
      const data = (await resp.json()) as { ok?: boolean; id?: string }
      if (!data.id) throw new Error('Sin ID')
      setSaveState('success')
    } catch (e) {
      setSaveState('error')
      setSaveError(e instanceof Error ? e.message : 'Error al guardar')
    }
  }

  function handleWhatsApp() {
    const message = buildWhatsAppMessage({
      checkout: { businessName, contactName, phone, deliveryAddress, notes },
      items,
      locationLabel: BUSINESS.locationLabel,
    })
    const url = buildWhatsAppUrl(CONTACT.whatsappPhoneE164, message)
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  function handleNewOrder() {
    setSaveState('idle')
    setSaveError('')
    setNotes('')
    onClear()
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Sheet */}
      <div className="relative mt-auto flex max-h-[92svh] w-full flex-col rounded-t-2xl bg-white shadow-xl">
        {/* Handle + Header */}
        <div className="shrink-0 border-b border-black/8 px-4 pb-3 pt-3">
          <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-black/15" />
          <div className="flex items-center justify-between">
            <div>
              <div className="text-base font-bold text-cg-black">Tu pedido</div>
              <div className="text-xs text-black/50">
                {items.length} productos, {totalItems} piezas
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-cg-gray text-lg text-black/60 active:bg-cg-gray-dark"
              aria-label="Cerrar"
            >
              x
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {saveState === 'success' ? (
            /* Pantalla de exito */
            <div className="flex flex-col items-center gap-4 p-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
                &#10003;
              </div>
              <div className="text-lg font-bold text-cg-black">Pedido enviado</div>
              <div className="text-sm text-black/60">
                Tu pedido fue registrado exitosamente. Te contactaremos pronto.
              </div>

              {hasWhatsApp && (
                <button
                  type="button"
                  onClick={handleWhatsApp}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3.5 text-sm font-bold text-white active:brightness-90"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Enviar por WhatsApp
                </button>
              )}

              <button
                type="button"
                onClick={handleNewOrder}
                className="w-full rounded-xl border border-black/12 px-4 py-3 text-sm font-bold text-cg-black active:bg-cg-gray"
              >
                Nuevo pedido
              </button>
            </div>
          ) : (
            <>
              {/* Lista de items */}
              <div className="border-b border-black/8 p-4">
                {items.length === 0 ? (
                  <div className="rounded-xl bg-cg-gray p-4 text-center text-sm text-black/50">
                    Agrega productos desde el catalogo
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {items.map((item) => (
                      <div
                        key={item.productId}
                        className="flex items-center justify-between gap-2 rounded-lg bg-cg-gray/60 px-3 py-2"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-semibold leading-tight text-cg-black">
                            {item.name}
                          </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-1">
                          <button
                            type="button"
                            onClick={() => onDecrement(item.productId)}
                            className="flex h-8 w-8 items-center justify-center rounded-md border border-black/10 text-sm font-bold active:bg-white"
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => onIncrement(item.productId)}
                            className="flex h-8 w-8 items-center justify-center rounded-md bg-cg-red text-sm font-bold text-white active:bg-cg-red-dark"
                          >
                            +
                          </button>
                          <button
                            type="button"
                            onClick={() => onRemove(item.productId)}
                            className="ml-1 flex h-8 w-8 items-center justify-center rounded-md text-black/30 active:text-red-500"
                            aria-label="Eliminar"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Formulario de datos */}
              <div className="p-4">
                <div className="mb-3 text-sm font-bold text-cg-black">Datos de contacto</div>
                <div className="flex flex-col gap-3">
                  <input
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Nombre del negocio *"
                    className="w-full rounded-xl border border-black/10 bg-cg-gray px-4 py-3 text-sm outline-none placeholder:text-black/40 focus:border-cg-red"
                  />
                  <input
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Nombre de contacto *"
                    className="w-full rounded-xl border border-black/10 bg-cg-gray px-4 py-3 text-sm outline-none placeholder:text-black/40 focus:border-cg-red"
                  />
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Telefono *"
                    inputMode="tel"
                    className="w-full rounded-xl border border-black/10 bg-cg-gray px-4 py-3 text-sm outline-none placeholder:text-black/40 focus:border-cg-red"
                  />
                  <input
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Direccion de entrega (opcional)"
                    className="w-full rounded-xl border border-black/10 bg-cg-gray px-4 py-3 text-sm outline-none placeholder:text-black/40 focus:border-cg-red"
                  />
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Notas: cortes especiales, horario de entrega..."
                    rows={2}
                    className="w-full resize-none rounded-xl border border-black/10 bg-cg-gray px-4 py-3 text-sm outline-none placeholder:text-black/40 focus:border-cg-red"
                  />
                </div>

                {saveState === 'error' && saveError && (
                  <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-xs text-red-700">
                    Error: {saveError}
                  </div>
                )}

                {!formValid && missing.length > 0 && (
                  <div className="mt-2 text-xs text-black/40">
                    Faltan: {missing.join(', ')}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer sticky */}
        {saveState !== 'success' && (
          <div className="shrink-0 border-t border-black/8 bg-white px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3">
            <button
              type="button"
              disabled={!formValid || saveState === 'saving'}
              onClick={handleSave}
              className="w-full rounded-xl bg-cg-red px-4 py-3.5 text-sm font-bold text-white disabled:opacity-40 active:bg-cg-red-dark"
            >
              {saveState === 'saving' ? 'Enviando...' : `Enviar pedido (${totalItems} pzas)`}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
