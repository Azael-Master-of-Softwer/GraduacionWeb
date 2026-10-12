import type { Actividad, Movimiento, ResumenFinanzas } from './finanzasTipos'
import { useDato } from './useDato'
import { useLista } from './useLista'

// Carga el resumen, las actividades y los movimientos de una sola vez
export function useFinanzas(token: string) {
  const resumen = useDato<ResumenFinanzas>('/api/Finanzas/resumen', token)
  const actividades = useLista<Actividad>('/api/Actividades', token)
  const movimientos = useLista<Movimiento>('/api/Movimientos', token)

  const recargar = () => {
    resumen.recargar()
    actividades.recargar()
    movimientos.recargar()
  }

  return {
    resumen: resumen.dato,
    actividades: actividades.datos,
    movimientos: movimientos.datos,
    error: resumen.error || actividades.error || movimientos.error,
    recargar,
  }
}
