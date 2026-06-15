const env = import.meta.env as unknown as Record<string, string | undefined>

export const BUSINESS = {
  name: 'Carnicos Gustavo',
  tagline: 'Centro de Distribucion (CEDIS) de Cerdo',
  locationLabel: env.VITE_LOCATION_LABEL?.trim() || 'Naucalpan, Estado de Mexico',
}

export const CONTACT = {
  whatsappPhoneE164: env.VITE_WHATSAPP_PHONE?.trim() || '525543287020',
}
