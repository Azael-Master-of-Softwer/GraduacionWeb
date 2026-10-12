import { rango } from './session'
import type { Sesion } from './session'

type Props = { titulo: string; sesion: Sesion; onSalir: () => void }

export default function Encabezado({ titulo, sesion, onSalir }: Props) {
  return (
    <header className="encabezado">
      <div>
        <h1>{titulo}</h1>
        <p className="suave">{sesion.email}</p>
        <span className="etiqueta rango">{rango(sesion.roles)}</span>
      </div>
      <button className="secundario" onClick={onSalir}>
        Cerrar sesión
      </button>
    </header>
  )
}
