import FinanzasVista from './FinanzasVista'
import { useFinanzas } from './useFinanzas'

export default function FinanzasLectura({ token }: { token: string }) {
  const f = useFinanzas(token)

  return (
    <FinanzasVista
      resumen={f.resumen}
      actividades={f.actividades}
      movimientos={f.movimientos}
      error={f.error}
    />
  )
}
