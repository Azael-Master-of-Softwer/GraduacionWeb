import { useEffect, useState } from 'react'
import { api, ApiError } from './api'

// Carga un solo dato (por ejemplo, el resumen del graduado) desde la API
export function useDato<T>(ruta: string, token: string) {
  const [dato, setDato] = useState<T | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let activo = true
    api<T>(ruta, {}, token)
      .then((respuesta) => {
        if (activo) {
          setDato(respuesta)
          setError('')
        }
      })
      .catch((err) => {
        if (activo) {
          setError(
            err instanceof ApiError ? err.message : 'No se pudo cargar la información.',
          )
        }
      })
    return () => {
      activo = false
    }
  }, [ruta, token])

  return { dato, error }
}
