import { CATEGORIES, CATEGORY_META, type Category } from '../data/products'

type Props = {
  active: Category
  onChange: (cat: Category) => void
}

export function CategoryChips({ active, onChange }: Props) {
  return (
    <div className="hide-scrollbar flex gap-2 overflow-x-auto px-4 py-2">
      {CATEGORIES.map((cat) => {
        const meta = CATEGORY_META[cat.id]
        const isActive = active === cat.id
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onChange(cat.id)}
            className={[
              'flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors',
              isActive
                ? 'bg-cg-red text-white'
                : 'bg-cg-gray text-cg-black active:bg-cg-gray-dark',
            ].join(' ')}
          >
            <span className="text-sm leading-none">{meta.emoji}</span>
            {cat.label}
          </button>
        )
      })}
    </div>
  )
}
