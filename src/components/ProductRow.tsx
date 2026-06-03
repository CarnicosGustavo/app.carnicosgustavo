import { CATEGORY_META, type Product } from '../data/products'
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
        inOrder ? 'border-black/20' : 'border-black/8',
      ].join(' ')}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1 text-[15px] font-extrabold leading-tight text-cg-black">
          {product.name}
        </div>

        {!inOrder ? (
          <button
            type="button"
            onClick={onAdd}
            className={[
              'shrink-0 rounded-xl px-4 py-2.5 text-sm font-bold shadow-sm',
              meta.solid,
            ].join(' ')}
          >
            + Agregar
          </button>
        ) : (
          <div className="flex shrink-0 items-center gap-0.5">
            <button
              type="button"
              onClick={onDecrement}
              className={[
                'flex h-9 w-9 items-center justify-center rounded-lg border text-lg font-bold',
                meta.outline,
              ].join(' ')}
              aria-label="Quitar uno"
            >
              -
            </button>
            <QtyInput
              value={quantity}
              onChange={onSetQuantity}
              className="h-9 w-14 rounded-lg border border-black/12 text-center text-sm font-bold text-cg-black outline-none focus:border-black/40"
            />
            <button
              type="button"
              onClick={onIncrement}
              className={[
                'flex h-9 w-9 items-center justify-center rounded-lg text-lg font-bold',
                meta.solid,
              ].join(' ')}
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
                unit === 'piezas' ? meta.solid : 'bg-white text-cg-black',
              ].join(' ')}
            >
              Piezas
            </button>
            <button
              type="button"
              onClick={() => onSetUnit('kg')}
              className={[
                'px-3 py-1 text-xs font-bold transition-colors',
                unit === 'kg' ? meta.solid : 'bg-white text-cg-black',
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
