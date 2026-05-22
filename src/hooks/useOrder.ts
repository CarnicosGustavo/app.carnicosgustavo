import { useCallback, useEffect, useMemo, useState } from 'react'

export type OrderItem = {
  productId: string
  name: string
  quantity: number
}

const STORAGE_KEY = 'cg_pedido_v1'

function loadFromStorage(): OrderItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const arr = JSON.parse(raw)
    if (!Array.isArray(arr)) return []
    return arr
      .map((item: Record<string, unknown>) => {
        if (typeof item.productId !== 'string' || typeof item.name !== 'string') return null
        const qty = Number(item.quantity)
        if (!Number.isFinite(qty) || qty < 1) return null
        return { productId: item.productId, name: item.name, quantity: Math.floor(qty) }
      })
      .filter(Boolean) as OrderItem[]
  } catch {
    return []
  }
}

export function useOrder() {
  const [items, setItems] = useState<OrderItem[]>(loadFromStorage)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const totalItems = useMemo(
    () => items.reduce((acc, x) => acc + x.quantity, 0),
    [items],
  )

  const getQuantity = useCallback(
    (productId: string) => items.find((x) => x.productId === productId)?.quantity ?? 0,
    [items],
  )

  const add = useCallback((productId: string, name: string) => {
    setItems((prev) => {
      const existing = prev.find((x) => x.productId === productId)
      if (existing) {
        return prev.map((x) =>
          x.productId === productId ? { ...x, quantity: x.quantity + 1 } : x,
        )
      }
      return [...prev, { productId, name, quantity: 1 }]
    })
  }, [])

  const increment = useCallback((productId: string) => {
    setItems((prev) =>
      prev.map((x) =>
        x.productId === productId ? { ...x, quantity: x.quantity + 1 } : x,
      ),
    )
  }, [])

  const decrement = useCallback((productId: string) => {
    setItems((prev) => {
      const existing = prev.find((x) => x.productId === productId)
      if (!existing) return prev
      if (existing.quantity <= 1) return prev.filter((x) => x.productId !== productId)
      return prev.map((x) =>
        x.productId === productId ? { ...x, quantity: x.quantity - 1 } : x,
      )
    })
  }, [])

  const setQuantity = useCallback((productId: string, qty: number) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((x) => x.productId !== productId))
    } else {
      setItems((prev) =>
        prev.map((x) =>
          x.productId === productId ? { ...x, quantity: Math.floor(qty) } : x,
        ),
      )
    }
  }, [])

  const remove = useCallback((productId: string) => {
    setItems((prev) => prev.filter((x) => x.productId !== productId))
  }, [])

  const clear = useCallback(() => {
    setItems([])
  }, [])

  return { items, totalItems, getQuantity, add, increment, decrement, setQuantity, remove, clear }
}
