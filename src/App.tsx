import { useMemo, useState } from 'react'

import { CartSheet } from './components/CartSheet'
import { CategoryChips } from './components/CategoryChips'
import { Logo } from './components/Logo'
import { ProductRow } from './components/ProductRow'
import { SearchBar } from './components/SearchBar'
import { Welcome } from './components/Welcome'
import { BUSINESS } from './config'
import { PRODUCTS, type Category } from './data/products'
import { useOrder } from './hooks/useOrder'
import type { Recognized } from './lib/recognition'
import { useTheme } from './theme'

type Screen = 'welcome' | 'catalog'

function App() {
  const order = useOrder()
  const { theme, toggle } = useTheme()
  const [screen, setScreen] = useState<Screen>(() => (order.items.length > 0 ? 'catalog' : 'welcome'))
  const [recognized, setRecognized] = useState<Recognized | null>(null)
  const [phone, setPhone] = useState('')
  const [cartOpen, setCartOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<Category>('todos')

  function enter(p: string, r: Recognized | null) {
    setPhone(p)
    setRecognized(r) // null si es cliente nuevo: nunca verá "repetir pedido"
    setScreen('catalog')
  }

  function handleNewOrder() {
    if (order.items.length > 0 && !window.confirm('¿Empezar un pedido nuevo? Se borrará el pedido actual.')) return
    order.clear()
    setSearch('')
    setCategory('todos')
    setCartOpen(false)
    window.scrollTo({ top: 0 })
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (q) return PRODUCTS.filter((p) => p.name.toLowerCase().includes(q))
    if (category !== 'todos') return PRODUCTS.filter((p) => p.category === category)
    return PRODUCTS
  }, [category, search])

  const showRepeat =
    recognized && recognized.items.length > 0 && order.items.length === 0

  if (screen === 'welcome') {
    return <Welcome onEnter={enter} />
  }

  return (
    <div className="flex min-h-svh flex-col bg-bg pb-24">
      {/* Header CEDIS */}
      <header className="sticky top-0 z-30 border-b border-line/10 bg-chrome">
        <div className="mx-auto w-full max-w-6xl">
          <div className="flex items-center gap-3 px-4 py-3">
            <Logo size={34} colorVar="var(--chrome-fg)" />
            <div className="min-w-0 flex-1 text-center">
              <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-red">Cárnicos</div>
              <div className="font-display text-lg leading-none text-chrome-fg">GUSTAVO</div>
            </div>
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="relative cg-tap flex h-9 items-center gap-2 rounded-full bg-red px-3.5 text-xs font-bold text-white"
              title="Ver pedido"
            >
              Ver pedido
              {order.totalItems > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 font-mono text-[11px] font-bold text-red">
                  {order.totalItems}
                </span>
              )}
            </button>
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setMenuOpen((o) => !o)}
                className={[
                  'cg-tap flex h-9 w-9 items-center justify-center rounded-full border',
                  menuOpen ? 'border-red bg-red text-white' : 'border-white/15 text-chrome-fg',
                ].join(' ')}
                aria-label="Ajustes"
                title="Ajustes"
              >
                <svg className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="3" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9c.2.61.74 1.05 1.39 1.1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z" />
                </svg>
              </button>
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                  <div className="cg-fade absolute right-0 top-11 z-50 w-60 rounded-2xl border border-line/12 bg-paper p-1.5 shadow-soft">
                    <div className="mb-1 flex items-center gap-2.5 border-b border-line/12 px-2.5 pb-2.5 pt-1.5">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-paper2 text-red">
                        <svg className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="12" cy="12" r="4" /><path strokeLinecap="round" d="M16 12v1.5a2.5 2.5 0 005 0V12a9 9 0 10-3.5 7.1" /></svg>
                      </span>
                      <div className="min-w-0">
                        <div className="truncate text-[13.5px] font-extrabold text-ink">{recognized ? recognized.businessName : 'Tu cuenta'}</div>
                        <div className="text-[11px] font-medium text-ink-soft">{recognized ? recognized.contactName || 'Cliente reconocido' : 'Invitado'}</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setMenuOpen(false); handleNewOrder() }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-[13px] font-bold text-ink active:bg-paper2"
                    >
                      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-red text-base font-bold leading-none text-white">+</span>
                      Pedido nuevo
                    </button>
                    <button
                      type="button"
                      onClick={() => { setMenuOpen(false); toggle() }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-[13px] font-bold text-ink active:bg-paper2"
                    >
                      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-paper2 text-ink-soft">{theme === 'dark' ? '☀' : '☾'}</span>
                      Tema: {theme === 'dark' ? 'Claro' : 'Oscuro'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="bg-bg px-4 pb-1 pt-3">
            <h1 className="font-display text-[27px] leading-none text-ink">Haz tu pedido</h1>
            <p className="mt-1.5 text-[13px] font-medium text-ink-soft">
              {recognized ? (
                <>
                  Hola, <span className="text-[16px] font-extrabold text-ink">{recognized.businessName || 'qué gusto verte'}</span>. Elige tus cortes y mándalos al CEDIS.
                </>
              ) : (
                `Elige tus cortes y mándalos al CEDIS de ${BUSINESS.locationLabel}.`
              )}
            </p>
          </div>
          <div className="bg-bg">
            <SearchBar value={search} onChange={setSearch} />
            <CategoryChips active={category} onChange={setCategory} />
          </div>
        </div>
      </header>

      {/* Lista */}
      <main className="relative flex-1 px-4 py-3">
        {/* Logo grande de fondo (se desvanece al abrir el carrito) */}
        <div
          className="pointer-events-none absolute bottom-[18%] right-[-6%] transition-opacity duration-300"
          style={{ opacity: cartOpen ? 0 : 0.04 }}
        >
          <Logo size={280} />
        </div>

        <div className="relative mx-auto w-full max-w-6xl">
          {showRepeat && (
            <div className="cg-fade mb-4 rounded-2xl border border-line/12 bg-paper p-4">
              <div className="flex items-center gap-3">
                <Logo size={32} colorVar="var(--ink)" />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-extrabold text-ink">Tu pedido de siempre</div>
                  <div className="mt-0.5 truncate text-xs text-ink-soft">
                    {recognized!.items.map((i) => i.name.toLowerCase()).slice(0, 3).join(', ')}
                    {recognized!.items.length > 3 ? ` +${recognized!.items.length - 3}` : ''}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => order.replaceAll(recognized!.items)}
                className="cg-tap mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-chrome px-3 py-3 text-[13.5px] font-extrabold text-chrome-fg"
              >
                Repetir pedido anterior
              </button>
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="mt-8 text-center text-sm text-ink-faint">No se encontraron productos</div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((product) => (
                <ProductRow
                  key={product.id}
                  product={product}
                  quantity={order.getQuantity(product.id)}
                  unit={order.getItem(product.id)?.unit ?? 'piezas'}
                  onAdd={() => order.add(product.id, product.name)}
                  onIncrement={() => order.increment(product.id)}
                  onDecrement={() => order.decrement(product.id)}
                  onSetUnit={(u) => order.setUnit(product.id, u)}
                  onSetQuantity={(q) => order.setQuantity(product.id, q)}
                />
              ))}
            </div>
          )}

          <div className="mt-4 pb-4 text-center text-xs text-ink-faint">
            {filtered.length} de {PRODUCTS.length} productos
          </div>
        </div>
      </main>

      {/* Botón flotante del carrito */}
      {order.totalItems > 0 && !cartOpen && (
        <div className="fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="cg-tap mx-auto flex w-full max-w-md items-center justify-between rounded-2xl bg-red px-5 py-4 shadow-soft"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 font-mono text-sm font-bold text-white">
                {order.totalItems}
              </div>
              <span className="text-sm font-bold text-white">Ver pedido</span>
            </div>
            <span className="text-sm font-bold text-white/80">{order.items.length} productos</span>
          </button>
        </div>
      )}

      <CartSheet
        open={cartOpen}
        items={order.items}
        initialPhone={phone}
        recognized={recognized}
        onClose={() => setCartOpen(false)}
        onIncrement={order.increment}
        onDecrement={order.decrement}
        onRemove={order.remove}
        onClear={order.clear}
        onSetUnit={order.setUnit}
        onSetQuantity={order.setQuantity}
        onReplaceAll={order.replaceAll}
      />
    </div>
  )
}

export default App
