import { useEffect, useState } from 'react'

type Props = {
  value: number
  onChange: (n: number) => void
  className?: string
}

/**
 * Input de cantidad que acepta decimales (kg/gramos) sin "cerrarse" al
 * escribir el punto. Mantiene un texto local mientras se edita y solo
 * confirma el número cuando es válido.
 */
export function QtyInput({ value, onChange, className }: Props) {
  const [text, setText] = useState(value ? String(value) : '')

  // Sincroniza si la cantidad cambia desde fuera (botones +/-)
  useEffect(() => {
    setText(value ? String(value) : '')
  }, [value])

  return (
    <input
      type="text"
      inputMode="decimal"
      value={text}
      onChange={(e) => {
        // Permite solo dígitos y un punto decimal
        let raw = e.target.value.replace(/[^\d.]/g, '')
        const firstDot = raw.indexOf('.')
        if (firstDot !== -1) {
          raw = raw.slice(0, firstDot + 1) + raw.slice(firstDot + 1).replace(/\./g, '')
        }
        setText(raw)
        const v = parseFloat(raw)
        if (Number.isFinite(v) && v > 0) onChange(v)
      }}
      onBlur={() => {
        if (!(parseFloat(text) > 0)) setText(value ? String(value) : '')
      }}
      onFocus={(e) => e.currentTarget.select()}
      className={className}
    />
  )
}
