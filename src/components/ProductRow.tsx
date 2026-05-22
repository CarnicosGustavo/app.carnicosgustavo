import type { Product } from '../data/products'

type Props = {
  product: Product
  quantity: number
  onAdd: () => void
  onIncrement: () => void
  onDecrement: () => void
}

export function ProductRow({ product, quantity, onAdd, onIncrement, onDecrement }: Props) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-xl border border-black/8 bg-white px-3 py-2.5 active:bg-cg-gray/60">
      <div className="min-w-0 flex-1">
        <div className="text-[13px] font-bold leading-tight text-cg-black">{product.name}</div>
      </div>

      {quantity <= 0 ? (
        <button
          type="button"
          onClick={onAdd}
          className="shrink-0 rounded-lg bg-cg-red px-3.5 py-2 text-xs font-bold text-white active:bg-cg-red-dark"
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
          <div className="flex h-9 w-10 items-center justify-center text-sm font-bold text-cg-black">
            {quantity}
          </div>
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
  )
}
