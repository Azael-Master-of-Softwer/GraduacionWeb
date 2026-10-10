import { useState } from 'react'
import Avisos from './Avisos'
import Eventos from './Eventos'
import Graduados from './Graduados'
import Pagos from './Pagos'
import type { Sesion } from './session'

type Seccion = 'graduados' | 'pagos' | 'avisos' | 'calendario'

const SECCIONES: { id: Seccion; texto: string }[] = [
  { id: 'graduados', texto: 'Graduados' },
  { id: 'pagos', texto: 'Pagos' },
  { id: 'avisos', texto: 'Avisos' },
  { id: 'calendario', texto: 'Calendario' },
]

type Props = { sesion: Sesion; onSalir: () => void }

export default function PanelAdmin({ sesion, onSalir }: Props) {
  const [seccion, setSeccion] = useState<Seccion>('graduados')

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

      <nav className="pestanas">
        {SECCIONES.map((s) => (
          <button
            key={s.id}
            type="button"
            className={`pestana ${seccion === s.id ? 'activa' : ''}`}
            onClick={() => setSeccion(s.id)}
          >
            {s.texto}
          </button>
        ))}
      </nav>

      {seccion === 'graduados' && <Graduados token={sesion.token} />}
      {seccion === 'pagos' && <Pagos token={sesion.token} />}
      {seccion === 'avisos' && <Avisos token={sesion.token} />}
      {seccion === 'calendario' && <Eventos token={sesion.token} />}
    </main>
  )
}
