import { useEffect, useState } from 'react'
import { api, ApiError } from './api'

// Carga un solo dato desde la API y permite volver a cargarlo con recargar()
export function useDato<T>(ruta: string, token: string) {
  const [dato, setDato] = useState<T | null>(null)
  const [error, setError] = useState('')
  const [version, setVersion] = useState(0)

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
  }, [ruta, token, version])

  const recargar = () => setVersion((v) => v + 1)

  return { dato, error, recargar }
}
