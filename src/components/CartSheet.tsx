import { useEffect, useRef, useState } from 'react'

import { BUSINESS, CONTACT } from '../config'
import type { OrderItem, Unit } from '../hooks/useOrder'
import { buildWhatsAppMessage, buildWhatsAppUrl } from '../lib/whatsapp'
import { lookupLastOrder, type Recognized } from '../lib/recognition'
import { Logo, WAGlyph } from './Logo'
import { QtyInput } from './QtyInput'

type SaveState = 'idle' | 'saving' | 'success' | 'error'

type Props = {
  open: boolean
  items: OrderItem[]
  initialPhone?: string
  recognized?: Recognized | null
  onClose: () => void
  onIncrement: (id: string) => void
  onDecrement: (id: string) => void
  onRemove: (id: string) => void
  onClear: () => void
  onSetUnit: (id: string, unit: Unit) => void
  onSetQuantity: (id: string, qty: number) => void
  onReplaceAll: (items: OrderItem[]) => void
}

const CUSTOMER_STORAGE_KEY = 'cg_pedido_customer_v1'

// Códigos postales precargados: CDMX + Estado de México (alcaldía/municipio).
const CP_LIST: [string, string][] = [
  ['06000', 'Centro · Cuauhtémoc'], ['06700', 'Roma Norte · Cuauhtémoc'], ['06140', 'Condesa · Cuauhtémoc'],
  ['03100', 'Del Valle · Benito Juárez'], ['03020', 'Narvarte · Benito Juárez'], ['11000', 'Lomas · Miguel Hidalgo'],
  ['11560', 'Polanco · Miguel Hidalgo'], ['01000', 'San Ángel · Álvaro Obregón'], ['04000', 'Centro · Coyoacán'],
  ['04100', 'Del Carmen · Coyoacán'], ['02000', 'Azcapotzalco'], ['07700', 'Lindavista · G.A. Madero'],
  ['08000', 'Centro · Iztacalco'], ['09000', 'Centro · Iztapalapa'], ['14000', 'Centro · Tlalpan'],
  ['16000', 'Centro · Xochimilco'], ['05000', 'Cuajimalpa'], ['15000', 'Moctezuma · V. Carranza'],
  ['53000', 'Centro · Naucalpan'], ['53100', 'Satélite · Naucalpan'], ['54000', 'Centro · Tlalnepantla'],
  ['52900', 'Atizapán de Zaragoza'], ['52780', 'Interlomas · Huixquilucan'], ['54700', 'Cuautitlán Izcalli'],
  ['55000', 'Centro · Ecatepec'], ['57000', 'Nezahualcóyotl'], ['55700', 'Coacalco'], ['54900', 'Tultitlán'],
  ['56500', 'Los Reyes · La Paz'], ['50000', 'Centro · Toluca'], ['52140', 'Metepec'], ['56600', 'Chalco'],
]

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

type IconName = 'user' | 'store' | 'phone' | 'pin' | 'note'
function Icon({ name, className = '' }: { name: IconName; className?: string }) {
  const paths: Record<IconName, string> = {
    user: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM4 21v-1a6 6 0 016-6h4a6 6 0 016 6v1',
    store: 'M4 9V5h16v4M4 9l-1 3h18l-1-3M5 12v7h14v-7',
    phone: 'M3 5a2 2 0 012-2h2l2 5-2 1a11 11 0 005 5l1-2 5 2v2a2 2 0 01-2 2A16 16 0 013 5z',
    pin: 'M12 21s7-5.5 7-11a7 7 0 10-14 0c0 5.5 7 11 7 11zM12 12a2.5 2.5 0 100-5 2.5 2.5 0 000 5z',
    note: 'M5 4h11l3 3v13H5zM9 4v5h7',
  }
  return (
    <svg className={className} width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d={paths[name]} />
    </svg>
  )
}

function Field({
  icon,
  value,
  onChange,
  onBlur,
  placeholder,
  valid,
  list,
  inputMode,
  maxLength,
  area,
}: {
  icon: IconName
  value: string
  onChange: (v: string) => void
  onBlur?: () => void
  placeholder: string
  valid?: boolean
  list?: string
  inputMode?: 'tel' | 'numeric' | 'text'
  maxLength?: number
  area?: boolean
}) {
  return (
    <div
      className={[
        'flex gap-2.5 rounded-xl border bg-paper2 transition-colors',
        area ? 'items-start px-3 py-3' : 'items-center px-3',
        valid ? 'border-green bg-green-wash' : 'border-line/12',
      ].join(' ')}
    >
      <span className={['shrink-0', valid ? 'text-green' : 'text-ink-soft', area ? 'pt-0.5' : ''].join(' ')}>
        <Icon name={icon} />
      </span>
      {area ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={2}
          className="w-full resize-none bg-transparent text-sm font-medium text-ink outline-none placeholder:text-ink-faint"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          list={list}
          inputMode={inputMode}
          maxLength={maxLength}
          className="w-full bg-transparent py-3 text-sm font-medium text-ink outline-none placeholder:text-ink-faint"
        />
      )}
      {valid && !area && (
        <svg className="h-4 w-4 shrink-0 text-green" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      )}
    </div>
  )
}

export function CartSheet({
  open,
  items,
  initialPhone,
  recognized,
  onClose,
  onIncrement,
  onDecrement,
  onRemove,
  onClear,
  onSetUnit,
  onSetQuantity,
  onReplaceAll,
}: Props) {
  const customer = useRef(loadCustomer())
  const [businessName, setBusinessName] = useState(customer.current.businessName)
  const [contactName, setContactName] = useState(customer.current.contactName)
  const [phone, setPhone] = useState(initialPhone || customer.current.phone)
  const [deliveryAddress, setDeliveryAddress] = useState(customer.current.deliveryAddress)
  const [notes, setNotes] = useState(customer.current.notes)
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const [saveError, setSaveError] = useState('')
  const [orderNumber, setOrderNumber] = useState<number | null>(null)
  const [lastOrder, setLastOrder] = useState<Recognized | null>(recognized ?? null)
  const [lookupDone, setLookupDone] = useState(false)

  // Prefill con el cliente reconocido en la bienvenida.
  useEffect(() => {
    if (recognized) {
      setLastOrder(recognized)
      setBusinessName((b) => b || recognized.businessName)
      setContactName((c) => c || recognized.contactName)
      setDeliveryAddress((d) => d || recognized.deliveryAddress || '')
    }
    // solo al montar
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function lookup() {
    const r = await lookupLastOrder(phone)
    setLookupDone(true)
    setLastOrder(r)
    if (r) {
      if (!businessName) setBusinessName(r.businessName)
      if (!contactName) setContactName(r.contactName)
      if (!deliveryAddress && r.deliveryAddress) setDeliveryAddress(r.deliveryAddress)
    }
  }

  function repeatLastOrder() {
    if (lastOrder && lastOrder.items.length > 0) {
      onReplaceAll(lastOrder.items)
      setLastOrder(null)
    }
  }

  useEffect(() => {
    localStorage.setItem(
      CUSTOMER_STORAGE_KEY,
      JSON.stringify({ businessName, contactName, phone, deliveryAddress, notes }),
    )
  }, [businessName, contactName, phone, deliveryAddress, notes])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (!open) return null

  const totalItems = items.reduce((a, x) => a + x.quantity, 0)
  // Requeridos: Contacto + WhatsApp. Negocio y CP opcionales.
  const formValid = !!contactName.trim() && !!phone.trim() && items.length > 0
  const hasWhatsApp = CONTACT.whatsappPhoneE164.replace(/[^\d]/g, '').length >= 11

  // Un solo paso: guarda en el sistema y abre WhatsApp con el pedido listo.
  async function handleSend() {
    if (!formValid) return
    setSaveState('saving')
    setSaveError('')
    try {
      const resp = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName, contactName, phone, deliveryAddress, notes,
          locationLabel: BUSINESS.locationLabel, items,
        }),
      })
      if (!resp.ok) {
        const data = (await resp.json().catch(() => ({}))) as { error?: string }
        throw new Error(data.error || `HTTP ${resp.status}`)
      }
      const data = (await resp.json()) as { id?: string; orderNumber?: number | null }
      if (!data.id) throw new Error('Sin ID')
      const num = data.orderNumber ?? null
      setOrderNumber(num)
      setSaveState('success')
      if (hasWhatsApp) openWhatsApp(num)
    } catch (e) {
      setSaveState('error')
      setSaveError(e instanceof Error ? e.message : 'Error al guardar')
    }
  }

  function openWhatsApp(num: number | null = orderNumber) {
    const message = buildWhatsAppMessage({
      checkout: { businessName, contactName, phone, deliveryAddress, notes },
      items, locationLabel: BUSINESS.locationLabel, orderNumber: num,
    })
    window.open(buildWhatsAppUrl(CONTACT.whatsappPhoneE164, message), '_blank', 'noopener,noreferrer')
  }

  function handleNewOrder() {
    setSaveState('idle'); setSaveError(''); setOrderNumber(null); setNotes('')
    onClear()
  }

  const cpValid = /^\d{5}$/.test(deliveryAddress.trim())

  return (
    <div className="fixed inset-0 z-50 flex flex-col">
      <div className="absolute inset-0 bg-black/55" onClick={onClose} />

      <div className="relative mt-auto flex max-h-[93svh] w-full flex-col rounded-t-2xl bg-bg shadow-sheet sm:mx-auto sm:max-w-md">
        {saveState === 'success' ? (
          /* ── Éxito: colores de la plataforma (claro/oscuro), sin azul ── */
          <div className="overflow-y-auto">
            <div className="bg-bg px-6 pb-7 pt-7">
              <div className="mb-4 flex justify-center">
                <Logo size={50} />
              </div>
              <div className="flex justify-end">
                <div className="max-w-[86%] rounded-2xl rounded-br-sm border border-green/40 bg-green-wash px-4 py-3 shadow-soft">
                  <div className="text-[15px] font-extrabold text-ink">
                    Pedido recibido{orderNumber ? ` #${orderNumber}` : ''}
                  </div>
                  <div className="mt-1 text-[13px] leading-snug text-ink-soft">
                    {items.length} productos · {totalItems} unidades. Te contactamos para confirmar y dar precio.
                  </div>
                  <div className="mt-1.5 flex items-center justify-end gap-1 text-[10px] font-semibold text-green">
                    Enviado
                    <svg className="h-3.5 w-3.5" viewBox="0 0 18 18" fill="none">
                      <path d="M3 9.5l2.5 2.5L10 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M7 9.5l2.5 2.5L14 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 bg-bg px-6 pb-7">
              {hasWhatsApp && (
                <>
                  <div className="text-center text-xs font-medium text-ink-soft">
                    ¿No se abrió el chat? Vuelve a enviarlo 👇
                  </div>
                  <button
                    type="button"
                    onClick={() => openWhatsApp()}
                    className="cg-tap flex w-full items-center justify-center gap-2.5 rounded-2xl bg-wa px-4 py-4 text-base font-extrabold text-white shadow-soft active:brightness-95"
                  >
                    <WAGlyph size={22} /> Abrir WhatsApp
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={handleNewOrder}
                className="cg-tap w-full rounded-2xl border border-line/15 bg-paper px-4 py-3.5 text-sm font-bold text-ink"
              >
                Hacer otro pedido
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="shrink-0 border-b border-line/10 px-4 pb-3 pt-3">
              <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-line/20" />
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <Logo size={40} />
                  <div className="min-w-0">
                    <div className="font-display text-[22px] leading-none text-ink">TU PEDIDO</div>
                    <div className="mt-1 text-xs font-semibold text-ink-soft">
                      {items.length} productos · {totalItems} unidades
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="cg-tap flex h-9 w-9 items-center justify-center rounded-full border border-line/15 bg-paper text-ink-soft"
                  aria-label="Cerrar"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Contenido */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              {/* Items */}
              <div className="border-b border-line/10 p-4">
                {items.length === 0 ? (
                  <div className="rounded-xl bg-paper2 p-4 text-center text-sm text-ink-soft">
                    Agrega productos desde el catálogo.
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {items.map((item) => (
                      <div key={item.productId} className="rounded-xl bg-paper px-3 py-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <div className="min-w-0 flex-1 text-xs font-bold uppercase leading-tight text-ink">
                            {item.name}
                          </div>
                          <div className="flex shrink-0 items-center gap-1">
                            <button type="button" onClick={() => onDecrement(item.productId)} className="cg-tap flex h-8 w-8 items-center justify-center rounded-md border border-line/15 text-sm font-bold text-ink">−</button>
                            <QtyInput value={item.quantity} onChange={(q) => onSetQuantity(item.productId, q)} className="h-8 w-14 rounded-md border border-line/15 bg-paper2 text-center font-mono text-sm font-bold text-ink outline-none focus:border-red" />
                            <button type="button" onClick={() => onIncrement(item.productId)} className="cg-tap flex h-8 w-8 items-center justify-center rounded-md bg-red text-sm font-bold text-white">+</button>
                            <button type="button" onClick={() => onRemove(item.productId)} className="ml-0.5 flex h-8 w-8 items-center justify-center rounded-md text-ink-faint active:text-red" aria-label="Eliminar">
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.9 12.1A2 2 0 0116.1 21H7.9a2 2 0 01-2-1.9L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          </div>
                        </div>
                        <div className="mt-1.5 inline-flex overflow-hidden rounded-md border border-line/15">
                          <button type="button" onClick={() => onSetUnit(item.productId, 'piezas')} className={['px-2.5 py-0.5 text-[11px] font-bold transition-colors', item.unit === 'piezas' ? 'bg-red text-white' : 'bg-paper text-ink-soft'].join(' ')}>Piezas</button>
                          <button type="button" onClick={() => onSetUnit(item.productId, 'kg')} className={['px-2.5 py-0.5 text-[11px] font-bold transition-colors', item.unit === 'kg' ? 'bg-red text-white' : 'bg-paper text-ink-soft'].join(' ')}>Kg</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Datos */}
              <div className="p-4">
                <div className="mb-2.5 text-xs font-bold uppercase tracking-wide text-ink-faint">Datos de contacto</div>
                <datalist id="cgCP">
                  {CP_LIST.map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </datalist>
                <div className="grid grid-cols-2 gap-2.5">
                  <Field icon="user" value={contactName} onChange={setContactName} placeholder="Contacto *" valid={!!contactName.trim()} />
                  <Field icon="store" value={businessName} onChange={setBusinessName} placeholder="Negocio (opcional)" valid={!!businessName.trim()} />
                  <Field icon="phone" value={phone} onChange={(v) => { setPhone(v); setLookupDone(false); setLastOrder(null) }} onBlur={lookup} placeholder="WhatsApp *" inputMode="tel" valid={phone.replace(/[^\d]/g, '').length >= 10} />
                  <Field icon="pin" value={deliveryAddress} onChange={setDeliveryAddress} placeholder="Código Postal" list="cgCP" inputMode="numeric" maxLength={5} valid={cpValid} />
                </div>

                {lastOrder && lastOrder.items.length > 0 && (
                  <div className="cg-fade mt-2.5 rounded-xl border border-green/40 bg-green-wash p-3">
                    <div className="text-xs font-bold text-ink">Bienvenido {lastOrder.businessName || 'de nuevo'}</div>
                    <div className="mt-0.5 text-[11px] text-ink-soft">Tu último pedido tiene {lastOrder.items.length} productos.</div>
                    <button type="button" onClick={repeatLastOrder} className="cg-tap mt-2 w-full rounded-lg bg-green px-3 py-2 text-xs font-bold text-white">
                      Repetir su último pedido
                    </button>
                  </div>
                )}
                {lookupDone && !lastOrder && phone.replace(/[^\d]/g, '').length >= 7 && (
                  <div className="mt-2 flex items-center gap-1.5 text-[11px] text-ink-faint">
                    WhatsApp nuevo — te damos de alta con este pedido.
                  </div>
                )}

                <div className="mt-2.5">
                  <Field icon="note" area value={notes} onChange={setNotes} placeholder="Notas: cortes especiales, horario…" />
                </div>

                {saveState === 'error' && saveError && (
                  <div className="mt-3 rounded-xl border border-red/30 bg-red/10 px-4 py-2 text-xs text-red">Error: {saveError}</div>
                )}
              </div>
            </div>

            {/* Footer — un solo botón verde (guarda + abre WhatsApp) */}
            <div className="shrink-0 border-t border-line/10 bg-paper px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3">
              <button
                type="button"
                disabled={!formValid || saveState === 'saving'}
                onClick={handleSend}
                className="cg-tap flex w-full items-center justify-center gap-3 rounded-2xl bg-wa px-4 py-3.5 text-white shadow-soft disabled:opacity-40"
              >
                <WAGlyph size={23} />
                <span className="flex flex-col items-start leading-tight">
                  <span className="text-base font-extrabold">
                    {saveState === 'saving' ? 'Enviando…' : `Enviar por WhatsApp${items.length > 0 ? ` · ${totalItems} pzas` : ''}`}
                  </span>
                  <span className="text-[11px] font-semibold text-white/85">Te abrimos el chat con tu pedido listo</span>
                </span>
              </button>
              {items.length > 0 && (
                <div className="mt-2 text-center text-[11px] font-medium text-ink-faint">
                  Al volver, tu pedido sigue guardado aquí.
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
