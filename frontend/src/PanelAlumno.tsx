import { useState } from 'react'
import AvisosAlumno from './AvisosAlumno'
import CalendarioAlumno from './CalendarioAlumno'
import Encabezado from './Encabezado'
import FinanzasLectura from './FinanzasLectura'
import InicioAlumno from './InicioAlumno'
import {
  IconoAvisos,
  IconoCalendario,
  IconoComite,
  IconoFinanzas,
  IconoInicio,
  IconoMovimientos,
} from './iconos'
import Navegacion from './Navegacion'
import type { ItemNavegacion } from './Navegacion'
import ResumenGeneral from './ResumenGeneral'
import type { Sesion } from './session'
import { useAvisosNuevos } from './useAvisosNuevos'
import VistaComite from './VistaComite'

type Pestana = 'inicio' | 'finanzas' | 'movimientos' | 'avisos' | 'calendario' | 'comite'

type Props = { sesion: Sesion; onSalir: () => void; esComite: boolean }

export default function PanelAlumno({ sesion, onSalir, esComite }: Props) {
  const [pestana, setPestana] = useState<Pestana>('inicio')
  const token = sesion.token
  const av = useAvisosNuevos(token, sesion.email)

  function ir(destino: Pestana) {
    // Al salir de Avisos, lo que ya estaba cargado cuenta como visto
    if (pestana === 'avisos' || destino === 'avisos') av.marcarVistos()
    setPestana(destino)
  }

  const items: ItemNavegacion[] = [
    { id: 'inicio', texto: 'Inicio', icono: <IconoInicio /> },
    { id: 'finanzas', texto: 'Finanzas', icono: <IconoFinanzas /> },
    { id: 'movimientos', texto: 'Movimientos', icono: <IconoMovimientos /> },
    {
      id: 'avisos',
      texto: 'Avisos',
      icono: <IconoAvisos />,
      insignia: pestana === 'avisos' ? 0 : av.nuevos,
    },
    { id: 'calendario', texto: 'Calendario', icono: <IconoCalendario /> },
  ]
  if (esComite) items.push({ id: 'comite', texto: 'Comité', icono: <IconoComite /> })

  return (
    <>
      <main className="tarjeta ancha con-nav">
        <Encabezado titulo="Mi graduación" sesion={sesion} onSalir={onSalir} />

        {av.nuevos > 0 && pestana !== 'avisos' && (
          <button type="button" className="alerta" onClick={() => ir('avisos')}>
            <span>
              🔔 {av.nuevos === 1 ? 'Nuevo aviso disponible' : `${av.nuevos} avisos nuevos`}
            </span>
            <strong>Ver</strong>
          </button>
        )}

        {pestana === 'inicio' && <InicioAlumno token={token} />}
        {pestana === 'finanzas' && (
          <>
            <ResumenGeneral token={token} partes="fondos" />
            <FinanzasLectura token={token} modo="resumen" />
          </>
        )}
        {pestana === 'movimientos' && <FinanzasLectura token={token} modo="movimientos" />}
        {pestana === 'avisos' && (
          <AvisosAlumno avisos={av.avisos} error={av.error} visto={av.visto} />
        )}
        {pestana === 'calendario' && <CalendarioAlumno token={token} />}
        {pestana === 'comite' && <VistaComite token={token} />}
      </main>

      <Navegacion items={items} activo={pestana} onElegir={(id) => ir(id as Pestana)} />
    </>
  )
}
