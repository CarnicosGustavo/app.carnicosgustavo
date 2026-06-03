import { CATEGORY_META, productEmoji, type Product } from '../data/products'
import type { Unit } from '../hooks/useOrder'
import { QtyInput } from './QtyInput'

type Props = {
  product: Product
  quantity: number
  unit: Unit
  onAdd: () => void
  onIncrement: () => void
  onDecrement: () => void
  onSetUnit: (unit: Unit) => void
  onSetQuantity: (qty: number) => void
}

export function ProductRow({
  product,
  quantity,
  unit,
  onAdd,
  onIncrement,
  onDecrement,
  onSetUnit,
  onSetQuantity,
}: Props) {
  const inOrder = quantity > 0
  const meta = CATEGORY_META[product.category]

  return (
    <div
      className={[
        'rounded-2xl border bg-white px-3 py-3 transition-colors active:bg-cg-gray/60',
        inOrder ? 'border-cg-red/40 ring-1 ring-cg-red/20' : 'border-black/8',
      ].join(' ')}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <div
            className={[
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl',
              meta.iconBg,
            ].join(' ')}
            aria-hidden
          >
            {productEmoji(product)}
          </div>
          <div className="min-w-0">
            <div className="truncate text-[15px] font-extrabold leading-tight text-cg-black">
              {product.name}
            </div>
            <div className="text-[11px] font-semibold uppercase tracking-wide text-black/35">
              {meta.label}
            </div>
          </div>
        </div>

        {!inOrder ? (
          <button
            type="button"
            onClick={onAdd}
            className="shrink-0 rounded-xl bg-cg-red px-4 py-2.5 text-sm font-bold text-white shadow-sm active:bg-cg-red-dark"
          >
            + Agregar
          </button>
        ) : (
          <div className="flex shrink-0 items-center gap-0.5">
            <button
              type="button"
              onClick={onDecrement}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-black/12 text-base font-bold text-cg-black active:bg-cg-gray"
              aria-label="Quitar uno"
            >
              -
            </button>
            <QtyInput
              value={quantity}
              onChange={onSetQuantity}
              className="h-9 w-14 rounded-lg border border-black/12 text-center text-sm font-bold text-cg-black outline-none focus:border-cg-red"
            />
            <button
              type="button"
              onClick={onIncrement}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-cg-red text-base font-bold text-white active:bg-cg-red-dark"
              aria-label="Agregar uno"
            >
              +
            </button>
          </div>
        )}
      </div>

      {/* Selector de unidad: solo visible cuando el producto está en el pedido */}
      {inOrder && (
        <div className="mt-2 flex items-center gap-2">
          <span className="text-[11px] font-medium text-black/40">Pedir en:</span>
          <div className="inline-flex overflow-hidden rounded-lg border border-black/10">
            <button
              type="button"
              onClick={() => onSetUnit('piezas')}
              className={[
                'px-3 py-1 text-xs font-bold transition-colors',
                unit === 'piezas' ? 'bg-cg-red text-white' : 'bg-white text-cg-black',
              ].join(' ')}
            >
              Piezas
            </button>
            <button
              type="button"
              onClick={() => onSetUnit('kg')}
              className={[
                'px-3 py-1 text-xs font-bold transition-colors',
                unit === 'kg' ? 'bg-cg-red text-white' : 'bg-white text-cg-black',
              ].join(' ')}
            >
              Kg
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
