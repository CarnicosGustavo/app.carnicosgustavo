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

// Color de los botones (+ / - / Agregar / toggle) según la categoría.
// Clases completas para que Tailwind las detecte. El nombre va siempre en negro.
export type CategoryStyle = {
  label: string
  solid: string // botón sólido: + e "+ Agregar" y toggle activo
  outline: string // botón outline: -
}

export const CATEGORY_META: Record<Category, CategoryStyle> = {
  todos: {
    label: 'Todos',
    solid: 'bg-cg-black text-white active:bg-black',
    outline: 'border-black/20 text-cg-black active:bg-cg-gray',
  },
  canales: {
    label: 'Canales',
    solid: 'bg-rose-600 text-white active:bg-rose-700',
    outline: 'border-rose-300 text-rose-700 active:bg-rose-50',
  },
  lomos: {
    label: 'Lomos',
    solid: 'bg-red-600 text-white active:bg-red-700',
    outline: 'border-red-300 text-red-700 active:bg-red-50',
  },
  jamones: {
    label: 'Jamones',
    solid: 'bg-amber-500 text-white active:bg-amber-600',
    outline: 'border-amber-300 text-amber-700 active:bg-amber-50',
  },
  cueros: {
    label: 'Cueros',
    solid: 'bg-orange-500 text-white active:bg-orange-600',
    outline: 'border-orange-300 text-orange-700 active:bg-orange-50',
  },
  pulpas: {
    label: 'Pulpas',
    solid: 'bg-pink-600 text-white active:bg-pink-700',
    outline: 'border-pink-300 text-pink-700 active:bg-pink-50',
  },
  visceras: {
    label: 'Vísceras',
    solid: 'bg-purple-600 text-white active:bg-purple-700',
    outline: 'border-purple-300 text-purple-700 active:bg-purple-50',
  },
  huesos: {
    label: 'Huesos',
    solid: 'bg-stone-600 text-white active:bg-stone-700',
    outline: 'border-stone-300 text-stone-700 active:bg-stone-50',
  },
  otros: {
    label: 'Otros',
    solid: 'bg-teal-600 text-white active:bg-teal-700',
    outline: 'border-teal-300 text-teal-700 active:bg-teal-50',
  },
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
