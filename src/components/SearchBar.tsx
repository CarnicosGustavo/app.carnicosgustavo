type Props = {
  value: string
  onChange: (v: string) => void
}

export function SearchBar({ value, onChange }: Props) {
  return (
    <div className="px-4 py-2">
      <div className="relative">
        <svg
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Buscar corte..."
          className="w-full rounded-xl border border-line/12 bg-paper2 py-3 pl-11 pr-10 text-sm font-medium text-ink outline-none placeholder:text-ink-faint focus:border-red/60"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute right-3 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full bg-line/15 text-xs text-ink-soft"
            aria-label="Limpiar busqueda"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}
