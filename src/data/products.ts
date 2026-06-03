export type Category =
  | 'todos'
  | 'canales'
  | 'lomos'
  | 'jamones'
  | 'cueros'
  | 'pulpas'
  | 'visceras'
  | 'huesos'
  | 'otros'

export type Product = {
  id: string
  name: string
  category: Category
}

export const CATEGORIES: { id: Category; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'canales', label: 'Canales' },
  { id: 'lomos', label: 'Lomos' },
  { id: 'jamones', label: 'Jamones' },
  { id: 'cueros', label: 'Cueros' },
  { id: 'pulpas', label: 'Pulpas' },
  { id: 'visceras', label: 'Visceras' },
  { id: 'huesos', label: 'Huesos' },
  { id: 'otros', label: 'Otros' },
]

// Estilo por categoría: emoji + colores (clases completas para que Tailwind las
// detecte). chip = inactivo, chipActive = seleccionado, iconBg = fondo del icono.
export type CategoryStyle = {
  label: string
  emoji: string
  chip: string
  chipActive: string
  iconBg: string
}

export const CATEGORY_META: Record<Category, CategoryStyle> = {
  todos: {
    label: 'Todos',
    emoji: '🍽️',
    chip: 'bg-cg-gray text-cg-black',
    chipActive: 'bg-cg-black text-white',
    iconBg: 'bg-cg-gray',
  },
  canales: {
    label: 'Canales',
    emoji: '🐷',
    chip: 'bg-rose-50 text-rose-700',
    chipActive: 'bg-rose-600 text-white',
    iconBg: 'bg-rose-100',
  },
  lomos: {
    label: 'Lomos',
    emoji: '🥩',
    chip: 'bg-red-50 text-red-700',
    chipActive: 'bg-red-600 text-white',
    iconBg: 'bg-red-100',
  },
  jamones: {
    label: 'Jamones',
    emoji: '🍗',
    chip: 'bg-amber-50 text-amber-700',
    chipActive: 'bg-amber-500 text-white',
    iconBg: 'bg-amber-100',
  },
  cueros: {
    label: 'Cueros',
    emoji: '🥓',
    chip: 'bg-orange-50 text-orange-700',
    chipActive: 'bg-orange-500 text-white',
    iconBg: 'bg-orange-100',
  },
  pulpas: {
    label: 'Pulpas',
    emoji: '🍖',
    chip: 'bg-pink-50 text-pink-700',
    chipActive: 'bg-pink-600 text-white',
    iconBg: 'bg-pink-100',
  },
  visceras: {
    label: 'Vísceras',
    emoji: '🫀',
    chip: 'bg-purple-50 text-purple-700',
    chipActive: 'bg-purple-600 text-white',
    iconBg: 'bg-purple-100',
  },
  huesos: {
    label: 'Huesos',
    emoji: '🦴',
    chip: 'bg-stone-100 text-stone-700',
    chipActive: 'bg-stone-600 text-white',
    iconBg: 'bg-stone-200',
  },
  otros: {
    label: 'Otros',
    emoji: '📦',
    chip: 'bg-teal-50 text-teal-700',
    chipActive: 'bg-teal-600 text-white',
    iconBg: 'bg-teal-100',
  },
}

// Icono por familia de corte: agrupa por la pieza de la que deriva el producto
// (todo lo de pierna -> 🍗, todo lo de lomo -> 🥩, etc.).
export function productEmoji(p: Product): string {
  const n = p.name.toUpperCase()
  if (/CANAL/.test(n)) return '🐷'
  if (/LOMO|FILETE|ESPILOMO/.test(n)) return '🥩'
  if (/JAMON|PIERNA|PULPA/.test(n)) return '🍗'
  if (/CUERO|PANZA|TOCINO/.test(n)) return '🥓'
  if (/CABEZA|CACHETE|OREJA|TROMPA|MASCARA|PAPADA|LENGUA|SESO|MORRO|MOLLEJA/.test(n)) return '🐽'
  if (/MANO|PATA/.test(n)) return '🦶'
  if (/COSTILLA|COSTILLAR|PECHO|CHULETA|ESPINAZO/.test(n)) return '🍖'
  if (/HUESO|CODILLO/.test(n)) return '🦴'
  if (/RIÑON|RINON|HIGADO|CORAZON|BUCHE|MENUDENCIA|VISCERA|RABO|NANA|PAJARILLA/.test(n)) return '🫀'
  if (/GRASA|MANTECA|DESGRASE|SEBO/.test(n)) return '🧈'
  return CATEGORY_META[p.category].emoji
}

export const PRODUCTS: Product[] = [
  // Canales
  { id: 'canal', name: 'CANAL', category: 'canales' },
  { id: 'canal-americano', name: 'CANAL AMERICANO', category: 'canales' },
  { id: 'canal-nacional-lomo', name: 'CANAL NACIONAL LADO LOMO', category: 'canales' },
  { id: 'canal-nacional-espilomo', name: 'CANAL NACIONAL LADO ESPILOMO', category: 'canales' },

  // Lomos
  { id: 'lomo', name: 'LOMO', category: 'lomos' },
  { id: 'lomo-completo-americano', name: 'LOMO COMPLETO AMERICANO', category: 'lomos' },
  { id: 'lomo-completo-np', name: 'LOMO COMPLETO N/P', category: 'lomos' },
  { id: 'lomo-usa', name: 'LOMO USA', category: 'lomos' },
  { id: 'lomo-s-cabeza', name: 'LOMO S/CABEZA', category: 'lomos' },
  { id: 'lomo-pinto', name: 'LOMO PINTO', category: 'lomos' },
  { id: 'c-lomo', name: 'C/LOMO', category: 'lomos' },
  { id: 'c-lomo-ch', name: 'C/LOMO C/H', category: 'lomos' },
  { id: 'espilomo', name: 'ESPILOMO', category: 'lomos' },
  { id: 'filete', name: 'FILETE', category: 'lomos' },

  // Jamones
  { id: 'jamon', name: 'JAMON', category: 'jamones' },
  { id: 'jamon-cg', name: 'JAMON C/G', category: 'jamones' },
  { id: 'jamon-pinto', name: 'JAMON PINTO', category: 'jamones' },
  { id: 'jamon-sh', name: 'JAMON S/H', category: 'jamones' },
  { id: 'pierna', name: 'PIERNA', category: 'jamones' },

  // Cueros
  { id: 'cuero', name: 'CUERO', category: 'cueros' },
  { id: 'cuero-recorte', name: 'CUERO RECORTE', category: 'cueros' },
  { id: 'cuero-cuadrado', name: 'CUERO CUADRADO', category: 'cueros' },
  { id: 'cueros-c-panza', name: 'CUEROS C/PANZA', category: 'cueros' },
  { id: 'cueros-s-panza', name: 'CUEROS S/PANZA', category: 'cueros' },

  // Pulpas
  { id: 'pulpa', name: 'PULPA', category: 'pulpas' },
  { id: 'pulpa-cg', name: 'PULPA C/G', category: 'pulpas' },
  { id: 'pulpa-espaldilla', name: 'PULPA DE ESPALDILLA', category: 'pulpas' },
  { id: 'pulpa-jamon', name: 'PULPA DE JAMON', category: 'pulpas' },
  { id: 'retazo', name: 'RETAZO', category: 'pulpas' },

  // Visceras y menudencias
  { id: 'buche', name: 'BUCHE', category: 'visceras' },
  { id: 'lengua', name: 'LENGUA', category: 'visceras' },
  { id: 'nana', name: 'NANA', category: 'visceras' },
  { id: 'rinon', name: 'RINON', category: 'visceras' },
  { id: 'sesos', name: 'SESOS', category: 'visceras' },
  { id: 'tripas', name: 'TRIPAS', category: 'visceras' },

  // Huesos y extremidades
  { id: 'hueso-americano', name: 'HUESO AMERICANO', category: 'huesos' },
  { id: 'espinazo', name: 'ESPINAZO', category: 'huesos' },
  { id: 'costillar', name: 'COSTILLAR', category: 'huesos' },
  { id: 'codillo', name: 'CODILLO', category: 'huesos' },
  { id: 'canas', name: 'CANA', category: 'huesos' },
  { id: 'manos', name: 'MANOS', category: 'huesos' },
  { id: 'patas', name: 'PATAS', category: 'huesos' },

  // Otros
  { id: 'ahumada', name: 'AHUMADA', category: 'otros' },
  { id: 'barriga', name: 'BARRIGA', category: 'otros' },
  { id: 'barriga-cc', name: 'BARRIGA C/C', category: 'otros' },
  { id: 'cabeza', name: 'CABEZA', category: 'otros' },
  { id: 'cachete', name: 'CACHETE', category: 'otros' },
  { id: 'capote', name: 'CAPOTE', category: 'otros' },
  { id: 'corbatas', name: 'CORBATA', category: 'otros' },
  { id: 'desgrase', name: 'DESGRASE', category: 'otros' },
  { id: 'espaldilla', name: 'ESPALDILLA', category: 'otros' },
  { id: 'grasa', name: 'GRASA', category: 'otros' },
  { id: 'lardo', name: 'LARDO', category: 'otros' },
  { id: 'manteca', name: 'MANTECA', category: 'otros' },
  { id: 'mascara', name: 'MASCARA', category: 'otros' },
  { id: 'mascara-completa', name: 'MASCARA COMPLETA', category: 'otros' },
  { id: 'mascara-recorte', name: 'RECORTE DE MASCARA', category: 'otros' },
  { id: 'orejas', name: 'OREJAS', category: 'otros' },
  { id: 'papada', name: 'PAPADA', category: 'otros' },
  { id: 'pecho', name: 'PECHO', category: 'otros' },
  { id: 'pecho-c-cuero', name: 'PECHO C/CUERO', category: 'otros' },
  { id: 'prensa-molida', name: 'PRENSA MOLIDA', category: 'otros' },
  { id: 'prensa-natural', name: 'PRENSA NATURAL', category: 'otros' },
  { id: 'rabos-carnudos', name: 'RABOS CARNUDOS', category: 'otros' },
  { id: 'rabos-pelones', name: 'RABOS PELONES', category: 'otros' },
  { id: 'sancocho', name: 'SANCOCHO', category: 'otros' },
  { id: 'tocino', name: 'TOCINO', category: 'otros' },
  { id: 'tocino-azul', name: 'TOCINO AZUL', category: 'otros' },
  { id: 'trompa', name: 'TROMPA', category: 'otros' },
]
