import { useState } from 'react'
import Encabezado from './Encabezado'
import { ContenidoGraduado } from './PanelGraduado'
import type { Sesion } from './session'
import VistaComite from './VistaComite'

type Pestana = 'mi' | 'comite'

type Props = { sesion: Sesion; onSalir: () => void }

export default function PanelComite({ sesion, onSalir }: Props) {
  const [pestana, setPestana] = useState<Pestana>('mi')

  return (
    <main className="tarjeta ancha">
      <Encabezado titulo="Comité" sesion={sesion} onSalir={onSalir} />

      <nav className="pestanas">
        <button
          type="button"
          className={`pestana ${pestana === 'mi' ? 'activa' : ''}`}
          onClick={() => setPestana('mi')}
        >
          Mi graduación
        </button>
        <button
          type="button"
          className={`pestana ${pestana === 'comite' ? 'activa' : ''}`}
          onClick={() => setPestana('comite')}
        >
          Comité
        </button>
      </nav>

      {pestana === 'mi' ? (
        <ContenidoGraduado token={sesion.token} />
      ) : (
        <VistaComite token={sesion.token} />
      )}
    </main>
  )
}
