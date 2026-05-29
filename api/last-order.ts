import { createClient } from '@supabase/supabase-js'

type ApiRequest = {
  method?: string
  url?: string
  query?: Record<string, string | string[] | undefined>
  headers?: Record<string, string | string[] | undefined>
}

type ApiResponse = {
  statusCode: number
  setHeader: (name: string, value: string) => void
  end: (body?: string) => void
}

function json(res: ApiResponse, status: number, body: unknown) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(body))
}

function onlyDigits(s: string) {
  return s.replace(/[^\d]/g, '')
}

// GET /api/last-order?phone=XXXX
// Devuelve el último pedido (datos del negocio + items) hecho con ese teléfono,
// para que el cliente pueda repetirlo con un toque.
export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'GET') {
    json(res, 405, { ok: false, error: 'Method not allowed' })
    return
  }

  const supabaseUrl = process.env.SUPABASE_URL?.trim()
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  const table = (process.env.SUPABASE_ORDERS_TABLE?.trim() || 'web_orders').trim()

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    json(res, 500, { ok: false, error: 'Supabase not configured' })
    return
  }

  // Leer ?phone= del query (Vercel lo provee en req.query) o parsear la URL
  let phoneRaw = ''
  const q = req.query?.phone
  if (typeof q === 'string') phoneRaw = q
  else if (Array.isArray(q)) phoneRaw = q[0] ?? ''
  else if (req.url) {
    try {
      const u = new URL(req.url, 'http://localhost')
      phoneRaw = u.searchParams.get('phone') ?? ''
    } catch {
      phoneRaw = ''
    }
  }

  const phone = onlyDigits(phoneRaw)
  if (phone.length < 7) {
    json(res, 200, { ok: true, found: false })
    return
  }

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { persistSession: false },
  })

  // Buscar por coincidencia de dígitos del teléfono
  const { data, error } = await supabase
    .from(table)
    .select('business_name, contact_name, phone, delivery_address, items, created_at')
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    json(res, 500, { ok: false, error: error.message })
    return
  }

  const match = (data ?? []).find((row) => onlyDigits(String(row.phone ?? '')) === phone)

  if (!match) {
    json(res, 200, { ok: true, found: false })
    return
  }

  json(res, 200, {
    ok: true,
    found: true,
    order: {
      businessName: match.business_name ?? '',
      contactName: match.contact_name ?? '',
      deliveryAddress: match.delivery_address ?? '',
      items: Array.isArray(match.items) ? match.items : [],
    },
  })
}
