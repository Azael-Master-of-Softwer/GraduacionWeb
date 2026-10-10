export const dinero = (n: number) =>
  n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })

// Fecha y hora en la zona horaria de quien mira la página
export const fechaHora = (iso: string) =>
  new Date(iso).toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' })

// Fechas de calendario: se guardan al mediodía UTC para que no cambien de día
export const soloFecha = (iso: string) =>
  new Date(iso).toLocaleDateString('es-MX', { dateStyle: 'medium', timeZone: 'UTC' })
