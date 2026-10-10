const API_URL = (
  (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:5052'
).replace(/\/+$/, '')

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

function mensajeDeError(texto: string, status: number): string {
  if (!texto) {
    return status === 429
      ? 'Demasiados intentos. Espera un minuto e inténtalo de nuevo.'
      : `Error ${status}`
  }
  try {
    const dato: unknown = JSON.parse(texto)
    if (typeof dato === 'string') return dato
    if (Array.isArray(dato)) {
      return dato
        .map((d) =>
          d && typeof d === 'object' && 'description' in d
            ? String((d as { description: unknown }).description)
            : String(d),
        )
        .join(' ')
    }
    if (dato && typeof dato === 'object') {
      const o = dato as { errors?: Record<string, string[]>; title?: string }
      if (o.errors) return Object.values(o.errors).flat().join(' ')
      if (o.title) return o.title
    }
  } catch {
    // No era JSON: es un texto simple y se devuelve tal cual
  }
  return texto
}

export async function api<T>(
  ruta: string,
  opciones: RequestInit = {},
  token?: string | null,
): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`

  const respuesta = await fetch(`${API_URL}${ruta}`, { ...opciones, headers })

  if (!respuesta.ok) {
    const texto = await respuesta.text()
    throw new ApiError(respuesta.status, mensajeDeError(texto, respuesta.status))
  }
  return (await respuesta.json()) as T
}
