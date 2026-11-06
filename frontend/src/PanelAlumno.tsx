import AvisosAlumno from './AvisosAlumno'
import CalendarioAlumno from './CalendarioAlumno'
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
import Layout from './Layout'
import type { ItemMenu } from './Layout'
import ResumenGeneral from './ResumenGeneral'
import type { Sesion } from './session'
import { useAvisosNuevos } from './useAvisosNuevos'
import { useSeccion } from './useSeccion'
import VistaComite from './VistaComite'

const PESTANAS = ['inicio', 'finanzas', 'movimientos', 'avisos', 'calendario', 'comite'] as const
type Pestana = (typeof PESTANAS)[number]

const DOS_COLUMNAS: Pestana[] = ['inicio', 'finanzas', 'calendario', 'comite']

type Props = { sesion: Sesion; onSalir: () => void; esComite: boolean }

export default function PanelAlumno({ sesion, onSalir, esComite }: Props) {
  const token = sesion.token
  const av = useAvisosNuevos(token, sesion.email)

  const [pestana, ir] = useSeccion<Pestana>(PESTANAS, 'inicio', (anterior, nueva) => {
    // Al entrar o salir de Avisos, lo que ya estaba cargado cuenta como visto
    if (anterior === 'avisos' || nueva === 'avisos') av.marcarVistos()
  })

  // Si alguien abre #comite sin ser del comité, se queda en Inicio
  const actual: Pestana = pestana === 'comite' && !esComite ? 'inicio' : pestana

  const items: ItemMenu[] = [
    { id: 'inicio', texto: 'Inicio', icono: <IconoInicio />, descripcion: 'Tu avance y el de la generación' },
    { id: 'finanzas', texto: 'Finanzas', icono: <IconoFinanzas />, descripcion: 'En qué va el dinero de la generación' },
    { id: 'movimientos', texto: 'Movimientos', icono: <IconoMovimientos />, descripcion: 'Ingresos y gastos registrados' },
    {
      id: 'avisos',
      texto: 'Avisos',
      icono: <IconoAvisos />,
      descripcion: 'Mensajes del comité',
      insignia: actual === 'avisos' ? 0 : av.nuevos,
    },
    { id: 'calendario', texto: 'Calendario', icono: <IconoCalendario />, descripcion: 'Fechas importantes y de pago' },
  ]
  if (esComite) {
    items.push({ id: 'comite', texto: 'Comité', icono: <IconoComite />, descripcion: 'Estado de pagos de todo el grupo' })
  }

  return (
    <Layout
      panel="Mi graduación"
      sesion={sesion}
      onSalir={onSalir}
      items={items}
      activo={actual}
      onElegir={(id) => ir(id as Pestana)}
      dosColumnas={DOS_COLUMNAS.includes(actual)}
    >
      {av.nuevos > 0 && actual !== 'avisos' && (
        <button type="button" className="alerta" onClick={() => ir('avisos')}>
          <span>
            🔔 {av.nuevos === 1 ? 'Nuevo aviso disponible' : `${av.nuevos} avisos nuevos`}
          </span>
          <strong>Ver</strong>
        </button>
      )}

      {actual === 'inicio' && (
        <>
          <ResumenGeneral token={token} />
          <InicioAlumno token={token} />
        </>
      )}
      {actual === 'finanzas' && (
        <>
          <ResumenGeneral token={token} partes="fondos" />
          <FinanzasLectura token={token} modo="resumen" />
        </>
      )}
      {actual === 'movimientos' && <FinanzasLectura token={token} modo="movimientos" />}
      {actual === 'avisos' && (
        <AvisosAlumno avisos={av.avisos} error={av.error} visto={av.visto} />
      )}
      {actual === 'calendario' && <CalendarioAlumno token={token} />}
      {actual === 'comite' && <VistaComite token={token} />}
    </Layout>
  )
}
