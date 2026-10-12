import { useState } from 'react'
import Avisos from './Avisos'
import Configuracion from './Configuracion'
import Encabezado from './Encabezado'
import Eventos from './Eventos'
import FinanzasAdmin from './FinanzasAdmin'
import Graduados from './Graduados'
import Pagos from './Pagos'
import ResumenGeneral from './ResumenGeneral'
import Usuarios from './Usuarios'
import type { Sesion } from './session'

type Seccion = 'inicio' | 'graduados' | 'pagos' | 'finanzas' | 'avisos' | 'calendario' | 'usuarios' | 'configuracion'

const SECCIONES: { id: Seccion; texto: string }[] = [
  { id: 'inicio', texto: 'Inicio' },
  { id: 'graduados', texto: 'Graduados' },
  { id: 'pagos', texto: 'Pagos' },
  { id: 'finanzas', texto: 'Finanzas' },
  { id: 'avisos', texto: 'Avisos' },
  { id: 'calendario', texto: 'Calendario' },
  { id: 'usuarios', texto: 'Usuarios' },
  { id: 'configuracion', texto: 'Configuración' },
]

type Props = { sesion: Sesion; onSalir: () => void }

export default function PanelAdmin({ sesion, onSalir }: Props) {
  const [seccion, setSeccion] = useState<Seccion>('inicio')

  return (
    <main className="tarjeta ancha">
      <Encabezado titulo="Administración" sesion={sesion} onSalir={onSalir} />

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
      {seccion === 'finanzas' && <FinanzasAdmin token={sesion.token} />}
      {seccion === 'avisos' && <Avisos token={sesion.token} />}
      {seccion === 'calendario' && <Eventos token={sesion.token} />}
      {seccion === 'usuarios' && <Usuarios token={sesion.token} />}
      {seccion === 'configuracion' && <Configuracion token={sesion.token} />}
    </main>
  )
}
