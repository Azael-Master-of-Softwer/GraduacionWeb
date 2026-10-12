import FinanzasVista from './FinanzasVista'
import type { ModoFinanzas } from './FinanzasVista'
import { useFinanzas } from './useFinanzas'

type Props = { token: string; modo?: ModoFinanzas }

export default function FinanzasLectura({ token, modo = 'todo' }: Props) {
  const f = useFinanzas(token)

  return (
    <FinanzasVista
      modo={modo}
      resumen={f.resumen}
      actividades={f.actividades}
      movimientos={f.movimientos}
      error={f.error}
    />
  )
}
