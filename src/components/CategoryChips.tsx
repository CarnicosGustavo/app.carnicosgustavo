import { CATEGORIES, type Category } from '../data/products'

type Props = {
  active: Category
  onChange: (cat: Category) => void
}

export function CategoryChips({ active, onChange }: Props) {
  return (
    <div className="hide-scrollbar flex gap-2 overflow-x-auto px-4 py-2">
      {CATEGORIES.map((cat) => {
        const isActive = active === cat.id
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onChange(cat.id)}
            className={[
              'cg-tap shrink-0 rounded-full px-4 py-2 text-sm font-bold transition-colors',
              isActive
                ? 'bg-red text-white shadow-soft'
                : 'bg-paper2 text-ink-soft border border-line/12',
            ].join(' ')}
          >
            {cat.label}
          </button>
        )
      })}
    </div>
  )
}
