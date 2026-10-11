export const dinero = (n: number) =>
  n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })

// Fecha y hora en la zona horaria de quien mira la página
export const fechaHora = (iso: string) =>
  new Date(iso).toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' })

// Fechas de calendario: se guardan al mediodía UTC para que no cambien de día
export const soloFecha = (iso: string) =>
  new Date(iso).toLocaleDateString('es-MX', { dateStyle: 'medium', timeZone: 'UTC' })

// Fecha de hoy (según el reloj de quien mira la página) como AAAA-MM-DD
export function hoyISO(): string {
  return new Date().toLocaleDateString('en-CA')
}

// Días que faltan para una fecha de calendario (negativo si ya pasó)
export function diasPara(iso: string): number {
  const destino = Date.UTC(
    Number(iso.slice(0, 4)),
    Number(iso.slice(5, 7)) - 1,
    Number(iso.slice(8, 10)),
  )
  const [a, m, d] = hoyISO().split('-').map(Number)
  const hoy = Date.UTC(a, m - 1, d)
  return Math.round((destino - hoy) / 86400000)
}
