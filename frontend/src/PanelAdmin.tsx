import Avisos from './Avisos'
import Configuracion from './Configuracion'
import Eventos from './Eventos'
import FinanzasAdmin from './FinanzasAdmin'
import Graduados from './Graduados'
import {
  IconoAvisos,
  IconoCalendario,
  IconoConfiguracion,
  IconoFinanzas,
  IconoGraduados,
  IconoInicio,
  IconoPagos,
  IconoUsuarios,
} from './iconos'
import Layout from './Layout'
import type { ItemMenu } from './Layout'
import Pagos from './Pagos'
import ResumenGeneral from './ResumenGeneral'
import type { Sesion } from './session'
import { useSeccion } from './useSeccion'
import Usuarios from './Usuarios'

const SECCIONES = [
  'inicio',
  'graduados',
  'pagos',
  'finanzas',
  'avisos',
  'calendario',
  'usuarios',
  'configuracion',
] as const
type Seccion = (typeof SECCIONES)[number]

const ITEMS: ItemMenu[] = [
  { id: 'inicio', texto: 'Inicio', icono: <IconoInicio />, descripcion: 'Resumen general de la generación' },
  { id: 'graduados', texto: 'Graduados', icono: <IconoGraduados />, descripcion: 'Lista de graduados y códigos de registro' },
  { id: 'pagos', texto: 'Pagos', icono: <IconoPagos />, descripcion: 'Aportaciones de cada graduado' },
  { id: 'finanzas', texto: 'Finanzas', icono: <IconoFinanzas />, descripcion: 'Actividades, ingresos y gastos del grupo' },
  { id: 'avisos', texto: 'Avisos', icono: <IconoAvisos />, descripcion: 'Mensajes para toda la generación' },
  { id: 'calendario', texto: 'Calendario', icono: <IconoCalendario />, descripcion: 'Fechas importantes y fechas de pago' },
  { id: 'usuarios', texto: 'Usuarios', icono: <IconoUsuarios />, descripcion: 'Cuentas y roles de acceso' },
  { id: 'configuracion', texto: 'Configuración', icono: <IconoConfiguracion />, descripcion: 'Fecha de graduación y meta por alumno' },
]

// Secciones con varios bloques que en pantalla ancha se acomodan en dos columnas
const DOS_COLUMNAS: Seccion[] = ['finanzas']

type Props = { sesion: Sesion; onSalir: () => void }

export default function PanelAdmin({ sesion, onSalir }: Props) {
  const [seccion, ir] = useSeccion<Seccion>(SECCIONES, 'inicio')
  const token = sesion.token

  return (
    <Layout
      panel="Administración"
      sesion={sesion}
      onSalir={onSalir}
      items={ITEMS}
      activo={seccion}
      onElegir={(id) => ir(id as Seccion)}
      dosColumnas={DOS_COLUMNAS.includes(seccion)}
    >
      {seccion === 'inicio' && <ResumenGeneral token={token} />}
      {seccion === 'graduados' && <Graduados token={token} />}
      {seccion === 'pagos' && <Pagos token={token} />}
      {seccion === 'finanzas' && <FinanzasAdmin token={token} />}
      {seccion === 'avisos' && <Avisos token={token} />}
      {seccion === 'calendario' && <Eventos token={token} />}
      {seccion === 'usuarios' && <Usuarios token={token} />}
      {seccion === 'configuracion' && <Configuracion token={token} />}
    </Layout>
  )
}
