export type Sesion = { token: string; email: string; roles: string[] }

const CLAVE = 'graduacion_token'
const CLAIM_ROL = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
const CLAIM_EMAIL =
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'

function leerToken(token: string): Record<string, unknown> | null {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const bytes = atob(base64)
      .split('')
      .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
      .join('')
    return JSON.parse(decodeURIComponent(bytes)) as Record<string, unknown>
  } catch {
    return null
  }
}

export function crearSesion(token: string): Sesion | null {
  const datos = leerToken(token)
  if (!datos) return null

  const exp = typeof datos.exp === 'number' ? datos.exp : 0
  if (exp * 1000 < Date.now()) return null // token vencido

  const rol = datos[CLAIM_ROL] ?? datos.role
  const roles = Array.isArray(rol) ? rol.map(String) : rol ? [String(rol)] : []
  const email = String(datos[CLAIM_EMAIL] ?? datos.email ?? '')

  return { token, email, roles }
}

export function guardarToken(token: string) {
  localStorage.setItem(CLAVE, token)
}

export function cargarSesion(): Sesion | null {
  const token = localStorage.getItem(CLAVE)
  return token ? crearSesion(token) : null
}

export function borrarSesion() {
  localStorage.removeItem(CLAVE)
}
