import type { Product } from '../data/products'
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

  return (
    <div
      className={[
        'rounded-2xl border bg-paper px-3.5 py-3 transition-colors',
        inOrder ? 'border-red/45' : 'border-line/10',
      ].join(' ')}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1 text-[15px] font-extrabold uppercase leading-tight tracking-tight text-ink">
          {product.name}
        </div>

        {!inOrder ? (
          <button
            type="button"
            onClick={onAdd}
            className="cg-tap shrink-0 rounded-xl bg-red px-4 py-2.5 text-sm font-bold text-white shadow-soft active:bg-red-dark"
          >
            + Agregar
          </button>
        ) : (
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={onDecrement}
              className="cg-tap flex h-9 w-9 items-center justify-center rounded-lg border border-line/15 bg-paper text-lg font-bold text-ink"
              aria-label="Quitar uno"
            >
              −
            </button>
            <QtyInput
              value={quantity}
              onChange={onSetQuantity}
              className="h-9 w-14 rounded-lg border border-line/15 bg-paper2 text-center font-mono text-sm font-bold text-ink outline-none focus:border-red"
            />
            <button
              type="button"
              onClick={onIncrement}
              className="cg-tap flex h-9 w-9 items-center justify-center rounded-lg bg-red text-lg font-bold text-white active:bg-red-dark"
              aria-label="Agregar uno"
            >
              +
            </button>
          </div>
        )}
      </div>

      {/* Selector de unidad: solo visible cuando el producto esta en el pedido */}
      {inOrder && (
        <div className="mt-2.5 flex items-center justify-between gap-2">
          <span className="text-[11px] font-semibold text-ink-soft">Pedir en</span>
          <div className="inline-flex overflow-hidden rounded-lg border border-line/15">
            <button
              type="button"
              onClick={() => onSetUnit('piezas')}
              className={[
                'px-3 py-1 text-xs font-bold transition-colors',
                unit === 'piezas' ? 'bg-red text-white' : 'bg-paper text-ink-soft',
              ].join(' ')}
            >
              Piezas
            </button>
            <button
              type="button"
              onClick={() => onSetUnit('kg')}
              className={[
                'px-3 py-1 text-xs font-bold transition-colors',
                unit === 'kg' ? 'bg-red text-white' : 'bg-paper text-ink-soft',
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
