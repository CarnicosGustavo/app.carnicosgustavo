# CLAUDE.md — Cárnicos Gustavo · App de Pedidos

Guía para trabajar en este repositorio. App web de pedidos para el CEDIS de
Cárnicos Gustavo: el cliente arma su pedido y se envía al CEDIS (se guarda en
Supabase y se confirma por WhatsApp).

## Stack
- **Vite 5** + **React 19** + **TypeScript** + **Tailwind 3**.
- Funciones serverless de **Vercel** en `api/` (runtime Node).
- Base de datos **Supabase** (Postgres). Deploy en **Vercel** (rama `main` → producción `app.carnicosgustavo.com`).

## Estructura
- `src/main.tsx` — punto de entrada; monta `<App/>`.
- `src/App.tsx` — reexporta el diseño desde `src/cgapp.tsx`.
- `src/cgapp.tsx` — **toda la UI "Cálida v2"** (bienvenida, catálogo, carrito, éxito).
  Es un módulo grande con `// @ts-nocheck` (portado del diseño original). Define
  tokens de tema, componentes y la raíz; usa estilos inline + tokens, no Tailwind.
- `src/config.ts` — `BUSINESS` y `CONTACT` desde variables `VITE_*`.
- `src/data/products.ts`, `src/hooks/useOrder.ts`, `src/lib/whatsapp.ts`,
  `src/components/*` — utilidades/versión previa (la UI activa vive en `cgapp.tsx`).
- `src/assets/ramon-*.png` — logo "Ramón" (cream / ink / máscara recoloreable).
- `src/index.css` — Tailwind + estilos del marco app móvil y animaciones.
- `api/orders.ts` — **crea el pedido** (POST). Inserta en `web_orders` con el
  service role; un trigger crea la fila en `orders` y devuelve su `id` (orderNumber).
- `api/last-order.ts` — consulta el último pedido.
- `vercel.json` — rewrites: `/api/orders` y SPA fallback a `index.html`.

## Flujo de un pedido
1. Cliente elige cortes (catálogo) → carrito.
2. Datos: **Contacto** y **WhatsApp** obligatorios; **Negocio** y **Código Postal** opcionales.
3. Botón verde "Enviar por WhatsApp": `POST /api/orders` → inserta en `web_orders`
   y abre `wa.me/<VITE_WHATSAPP_PHONE>` con el mensaje del pedido.

## Variables de entorno (Vercel → Settings → Environment Variables)
- `VITE_WHATSAPP_PHONE` — número del CEDIS (E.164 sin símbolos, ej. `525543287020`). Fallback en código: `525543287020`.
- `VITE_LOCATION_LABEL` — etiqueta de ubicación (ej. "Naucalpan, Estado de México").
- `SUPABASE_URL` — URL del proyecto Supabase.
- `SUPABASE_SERVICE_ROLE_KEY` — service role (solo backend `api/`, nunca expuesto al cliente).
- `SUPABASE_ORDERS_TABLE` — opcional; por defecto `web_orders`.

> Tras cambiar variables en Vercel, hay que **Redeploy** para que tomen efecto.

## Supabase
- Tabla `web_orders`: source, business_name, contact_name, phone, delivery_address,
  notes, location_label, items (jsonb), items_count, user_agent, whatsapp_message.
  RLS bloquea acceso anónimo; solo el service role (en `api/orders.ts`) inserta.
- Tabla `orders`: un trigger crea la orden del dashboard ligada por `web_order_id`.

## Diseño (Cálida v2)
- Fuentes: **Anton** (display), **Archivo** (UI), **JetBrains Mono** (cantidades).
- Acentos: rojo ladrillo (`#9E3326` claro / `#DA5742` oscuro), verde WhatsApp `#25D366`,
  verde tinta `#21302A` (botón "Empezar pedido" y campos válidos).
- **Modo claro/oscuro automático** según `prefers-color-scheme` (en vivo).
- Íconos con `lucide-react`.

## Comandos
- `npm install`
- `npm run dev` — desarrollo (Vite, puerto 5174).
- `npm run build` — `tsc -b && vite build` (debe pasar antes de subir).
- `npm run preview` — sirve el build.

## Deploy
- Push a `main` → Vercel despliega automáticamente a `app.carnicosgustavo.com`.
- Verifica siempre `npm run build` localmente antes de hacer push.

## Convenciones
- `src/cgapp.tsx` lleva `@ts-nocheck` a propósito (porte de diseño); el resto del
  repo es TypeScript estricto. Mantén los cambios de UI dentro de `cgapp.tsx`.
- No expongas `SUPABASE_SERVICE_ROLE_KEY` al cliente (solo en `api/`).
