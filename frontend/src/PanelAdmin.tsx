import { useState } from 'react'
import Avisos from './Avisos'
import Configuracion from './Configuracion'
import Eventos from './Eventos'
import Graduados from './Graduados'
import Pagos from './Pagos'
import ResumenGeneral from './ResumenGeneral'
import type { Sesion } from './session'

type Seccion = 'inicio' | 'graduados' | 'pagos' | 'avisos' | 'calendario' | 'configuracion'

const SECCIONES: { id: Seccion; texto: string }[] = [
  { id: 'inicio', texto: 'Inicio' },
  { id: 'graduados', texto: 'Graduados' },
  { id: 'pagos', texto: 'Pagos' },
  { id: 'avisos', texto: 'Avisos' },
  { id: 'calendario', texto: 'Calendario' },
  { id: 'configuracion', texto: 'Configuración' },
]

type Props = { sesion: Sesion; onSalir: () => void }

export default function PanelAdmin({ sesion, onSalir }: Props) {
  const [seccion, setSeccion] = useState<Seccion>('inicio')

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

      {seccion === 'inicio' && <ResumenGeneral token={sesion.token} />}
      {seccion === 'graduados' && <Graduados token={sesion.token} />}
      {seccion === 'pagos' && <Pagos token={sesion.token} />}
      {seccion === 'avisos' && <Avisos token={sesion.token} />}
      {seccion === 'calendario' && <Eventos token={sesion.token} />}
      {seccion === 'configuracion' && <Configuracion token={sesion.token} />}
    </main>
  )
}
