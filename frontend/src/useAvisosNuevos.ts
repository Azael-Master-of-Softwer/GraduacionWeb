import { useState } from 'react'
import { useLista } from './useLista'

export type Aviso = {
  id: number
  titulo: string
  mensaje: string
  fecha: string
  estado: string
}

// Avisos de la generación y cuántos son nuevos para esta persona.
// "Visto" se guarda en este dispositivo, separado por correo.
export function useAvisosNuevos(token: string, email: string) {
  const avisos = useLista<Aviso>('/api/Avisos', token, 120000)
  const clave = `graduacion_avisos_visto_${email}`

  const [visto, setVisto] = useState<number>(() => {
    try {
      return Number(localStorage.getItem(clave) ?? 0) || 0
    } catch {
      return 0
    }
  })

  const lista = avisos.datos ?? []
  const nuevos = lista.filter((a) => a.id > visto).length
  const mayorId = lista.reduce((m, a) => Math.max(m, a.id), 0)

  function marcarVistos() {
    if (mayorId <= visto) return
    try {
      localStorage.setItem(clave, String(mayorId))
    } catch {
      // Si el navegador no deja guardar, solo se pierde el recordatorio
    }
    setVisto(mayorId)
  }

  return { avisos: avisos.datos, error: avisos.error, nuevos, visto, marcarVistos }
}
