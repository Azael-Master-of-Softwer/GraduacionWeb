// Copia un texto al portapapeles; devuelve false si el navegador no lo permite
export async function copiarTexto(texto: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(texto)
    return true
  } catch {
    return false
  }
}

// Descarga una tabla como archivo CSV (con acentos bien en Excel)
export function descargarCsv(nombreArchivo: string, filas: string[][]) {
  const celda = (valor: string) => `"${valor.replace(/"/g, '""')}"`
  const csv = filas.map((fila) => fila.map(celda).join(',')).join('\r\n')
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const enlace = document.createElement('a')
  enlace.href = url
  enlace.download = nombreArchivo
  enlace.click()
  URL.revokeObjectURL(url)
}

// Mensaje listo para mandar por WhatsApp a cada persona
export function mensajeDeCodigo(codigo: string): string {
  return (
    `Tu código de registro para la página de la graduación es: ${codigo}\n` +
    `Entra a ${window.location.origin}, toca "Crear mi cuenta" y escríbelo.`
  )
}
