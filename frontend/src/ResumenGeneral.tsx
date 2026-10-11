import { diasPara, dinero, soloFecha } from './formato'
import { useDato } from './useDato'

export type General = {
  fechaGraduacion: string | null
  metaPorAlumno: number | null
  totalRecaudado: number
  totalMeta: number
  graduados: number
  registrados: number
}

function CuentaRegresiva({ fecha }: { fecha: string | null }) {
  if (!fecha) {
    return (
      <div className="cuenta">
        <span className="suave">Graduación</span>
        <strong className="cuenta-grande">Fecha por definir</strong>
      </div>
    )
  }

  const dias = diasPara(fecha)

  if (dias < 0) {
    return (
      <div className="cuenta">
        <span className="suave">{soloFecha(fecha)}</span>
        <strong className="cuenta-grande">¡Felicidades, generación!</strong>
      </div>
    )
  }

  if (dias === 0) {
    return (
      <div className="cuenta">
        <span className="suave">{soloFecha(fecha)}</span>
        <strong className="cuenta-grande">¡Hoy es el gran día!</strong>
      </div>
    )
  }

  const meses = Math.floor(dias / 30)

  return (
    <div className="cuenta">
      <span className="suave">Faltan para la graduación</span>
      <strong className="cuenta-grande">
        {dias} {dias === 1 ? 'día' : 'días'}
      </strong>
      <span className="suave">
        {meses >= 1 ? `≈ ${meses} ${meses === 1 ? 'mes' : 'meses'} · ` : ''}
        {soloFecha(fecha)}
      </span>
    </div>
  )
}

export function VistaGeneral({ general }: { general: General }) {
  const porcentaje =
    general.totalMeta > 0
      ? Math.min(100, Math.round((general.totalRecaudado / general.totalMeta) * 100))
      : 0

  return (
    <>
      <CuentaRegresiva fecha={general.fechaGraduacion} />

      <h3>Fondos de la generación</h3>
      {general.totalMeta > 0 ? (
        <>
          <div
            className="barra"
            role="progressbar"
            aria-valuenow={porcentaje}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div style={{ width: `${porcentaje}%` }} />
          </div>
          <p className="porcentaje">
            {dinero(general.totalRecaudado)}{' '}
            <span className="suave">de {dinero(general.totalMeta)} ({porcentaje}%)</span>
          </p>
        </>
      ) : (
        <p className="suave">Aún no hay una meta definida.</p>
      )}

      <p className="suave">
        {general.registrados} de {general.graduados}{' '}
        {general.graduados === 1 ? 'compañero ya tiene' : 'compañeros ya tienen'} su cuenta
        {general.metaPorAlumno ? ` · Meta por persona: ${dinero(general.metaPorAlumno)}` : ''}
      </p>
    </>
  )
}

export default function ResumenGeneral({ token }: { token: string }) {
  const { dato, error } = useDato<General>('/api/Configuracion/general', token)

  return (
    <section>
      <h2>Nuestra generación</h2>
      {error && <p className="error">{error}</p>}
      {!dato && !error && <p className="suave">Cargando…</p>}
      {dato && <VistaGeneral general={dato} />}
    </section>
  )
}
