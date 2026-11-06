import { useEffect, useRef, useState } from 'react'

// Guarda la sección abierta en la dirección (#pagos, #avisos…).
// Así, al recargar la página se queda donde estabas y el botón "atrás" del
// navegador regresa a la sección anterior.
function leer<T extends string>(validas: readonly T[], inicial: T): T {
  const hash = decodeURIComponent(window.location.hash.slice(1))
  return (validas as readonly string[]).includes(hash) ? (hash as T) : inicial
}

export function useSeccion<T extends string>(
  validas: readonly T[],
  inicial: T,
  alCambiar?: (anterior: T, nueva: T) => void,
): [T, (nueva: T) => void] {
  const [seccion, setSeccion] = useState<T>(() => leer(validas, inicial))
  const actual = useRef(seccion)
  const aviso = useRef(alCambiar)

  useEffect(() => {
    aviso.current = alCambiar
  })

  useEffect(() => {
    function alMoverse() {
      const nueva = leer(validas, inicial)
      if (nueva === actual.current) return
      aviso.current?.(actual.current, nueva)
      actual.current = nueva
      setSeccion(nueva)
      window.scrollTo({ top: 0 })
    }
    window.addEventListener('hashchange', alMoverse)
    return () => window.removeEventListener('hashchange', alMoverse)
  }, [validas, inicial])

  function ir(nueva: T) {
    if (nueva === actual.current) return
    // Cambiar el hash dispara "hashchange", que actualiza la sección
    window.location.hash = nueva
  }

  return [seccion, ir]
}

export function limpiarSeccion() {
  history.replaceState(null, '', window.location.pathname + window.location.search)
}
