import { useMemo, useState } from 'react'

import { CartSheet } from './components/CartSheet'
import { CategoryChips } from './components/CategoryChips'
import { ProductRow } from './components/ProductRow'
import { SearchBar } from './components/SearchBar'
import { PRODUCTS, type Category } from './data/products'
import { useOrder } from './hooks/useOrder'

function App() {
  const order = useOrder()
  const [cartOpen, setCartOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<Category>('todos')

  // Si hay texto de búsqueda, ignorar categoría y buscar en todos
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (q) {
      return PRODUCTS.filter((p) => p.name.toLowerCase().includes(q))
    }
    if (category !== 'todos') {
      return PRODUCTS.filter((p) => p.category === category)
    }
    return PRODUCTS
  }, [category, search])

  return (
    <div className="flex min-h-svh flex-col bg-white pb-20">
      {/* Header fijo */}
      <header className="sticky top-0 z-30 border-b border-black/8 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto w-full max-w-6xl">
          <div className="flex items-center gap-3 px-4 py-3">
            <img
              src="/images/favicon_cerdo.png"
              alt=""
              className="h-8 w-8 shrink-0 rounded-full ring-1 ring-black/10"
              loading="eager"
            />
            <div className="min-w-0 flex-1">
              <div className="text-sm font-bold text-cg-black">Carnicos Gustavo</div>
              <div className="text-[11px] text-black/50">Hacer pedido</div>
            </div>
            <a
              href="https://carnicosgustavo.com"
              target="_blank"
              rel="noreferrer"
              className="shrink-0 text-xs font-semibold text-cg-red"
            >
              Ver sitio
            </a>
          </div>

          <SearchBar value={search} onChange={setSearch} />
          <CategoryChips active={category} onChange={setCategory} />
        </div>
      </header>

      {/* Lista de productos */}
      <main className="flex-1 px-4 py-3">
        <div className="mx-auto w-full max-w-6xl">
          {filtered.length === 0 ? (
            <div className="mt-8 text-center text-sm text-black/40">
              No se encontraron productos
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((product) => (
                <ProductRow
                  key={product.id}
                  product={product}
                  quantity={order.getQuantity(product.id)}
                  unit={order.getItem(product.id)?.unit ?? "piezas"}
                  onAdd={() => order.add(product.id, product.name)}
                  onIncrement={() => order.increment(product.id)}
                  onDecrement={() => order.decrement(product.id)}
                  onSetUnit={(u) => order.setUnit(product.id, u)}
                  onSetQuantity={(q) => order.setQuantity(product.id, q)}
                />
              ))}
            </div>
          )}

          <div className="mt-4 pb-4 text-center text-xs text-black/30">
            {filtered.length} de {PRODUCTS.length} productos
          </div>
        </div>
      </main>

      {/* Boton flotante del carrito */}
      {order.totalItems > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="mx-auto flex w-full max-w-6xl items-center justify-between rounded-2xl bg-cg-red px-5 py-4 shadow-lg active:bg-cg-red-dark sm:ml-auto sm:max-w-sm hover:bg-cg-red-dark"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-sm font-bold text-white">
                {order.totalItems}
              </div>
              <span className="text-sm font-bold text-white">Ver pedido</span>
            </div>
            <span className="text-sm font-bold text-white/80">
              {order.items.length} productos
            </span>
          </button>
        </div>
      )}

      {/* Sheet del carrito */}
      <CartSheet
        open={cartOpen}
        items={order.items}
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
