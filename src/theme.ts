import { useEffect, useState } from 'react'

export type Theme = 'dark' | 'light'

const KEY = 'cg_theme_v1'

/** Tema cálido claro/oscuro. Persiste en localStorage y aplica `data-theme`
 *  en <html> (el anti-flash inicial vive en index.html). */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'dark'
    return (localStorage.getItem(KEY) as Theme) === 'light' ? 'light' : 'dark'
  })

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem(KEY, theme)
  }, [theme])

  return {
    theme,
    setTheme,
    toggle: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')),
  }
}
