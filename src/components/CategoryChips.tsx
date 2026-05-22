import { CATEGORIES, type Category } from '../data/products'

type Props = {
  active: Category
  onChange: (cat: Category) => void
}

export function CategoryChips({ active, onChange }: Props) {
  return (
    <div className="hide-scrollbar flex gap-2 overflow-x-auto px-4 py-2">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          type="button"
          onClick={() => onChange(cat.id)}
          className={[
            'shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors',
            active === cat.id
              ? 'bg-cg-red text-white'
              : 'bg-cg-gray text-cg-black active:bg-cg-gray-dark',
          ].join(' ')}
        >
          {cat.label}
        </button>
      ))}
    </div>
  )
}
