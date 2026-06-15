/** @type {import('tailwindcss').Config} */
// Tokens del rediseño Cárnicos Gustavo (cálido, claro/oscuro).
// Los colores apuntan a variables CSS definidas en src/index.css por tema,
// usando el patrón `rgb(var(--x) / <alpha-value>)` para que funcionen las
// opacidades de Tailwind (p.ej. border-line/15, bg-red/10).
const token = (name) => `rgb(var(${name}) / <alpha-value>)`

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: token('--bg'),
        paper: token('--paper'),
        paper2: token('--paper2'),
        ink: token('--ink'),
        'ink-soft': token('--ink-soft'),
        'ink-faint': token('--ink-faint'),
        line: token('--line'),
        red: token('--red'),
        'red-dark': token('--red-dark'),
        green: token('--green'),
        'green-wash': token('--green-wash'),
        chrome: token('--chrome'),
        'chrome-fg': token('--chrome-fg'),
        wa: token('--wa'),
        'wa-dark': token('--wa-dark'),
        // Compatibilidad con clases previas (cg-*)
        cg: {
          red: token('--red'),
          'red-dark': token('--red-dark'),
          black: token('--ink'),
          white: token('--paper'),
          gray: token('--paper2'),
          'gray-dark': token('--line'),
        },
      },
      fontFamily: {
        sans: ['Archivo', 'system-ui', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Anton', 'Archivo', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        soft: '0 8px 22px -16px rgb(0 0 0 / 0.45)',
        sheet: '0 -18px 50px -22px rgb(0 0 0 / 0.55)',
      },
    },
  },
  plugins: [],
}
