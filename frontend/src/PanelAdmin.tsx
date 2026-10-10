import Graduados from './Graduados'
import type { Sesion } from './session'

type Props = { sesion: Sesion; onSalir: () => void }

export default function PanelAdmin({ sesion, onSalir }: Props) {
  return (
    <main className="tarjeta ancha">
      <header className="encabezado">
        <div>
          <h1>Administración</h1>
          <p className="suave">{sesion.email}</p>
        </div>
        <button className="secundario" onClick={onSalir}>
          Cerrar sesión
        </button>
      </header>

      <Graduados token={sesion.token} />
    </main>
  )
}
