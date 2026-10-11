import { useState } from 'react'
import { dinero, fechaHora, hoyISO, soloFecha } from './formato'
import type { Sesion } from './session'
import { useDato } from './useDato'
import { useLista } from './useLista'

type PagoResumen = {
  fecha: string
  monto: number
  concepto: string
  estado: string
}

type Resumen = {
  identificador: string
  totalGraduacion: number
  totalPagado: number
  pendiente: number
  pagos: PagoResumen[]
}

type Aviso = { id: number; titulo: string; mensaje: string; fecha: string; estado: string }

type Evento = {
  id: number
  fecha: string
  titulo: string
  tipo: string
  descripcion: string
  estado: string
}

function MiProgreso({ token }: { token: string }) {
  const { dato, error } = useDato<Resumen>('/api/Graduados/mi-resumen', token)

  if (error) {
    return (
      <section>
        <h2>Mi progreso</h2>
        <p className="error">{error}</p>
      </section>
    )
  }
  if (!dato) {
    return (
      <section>
        <h2>Mi progreso</h2>
        <p className="suave">Cargando… la primera vez puede tardar un poco.</p>
      </section>
    )
  }

  const porcentaje =
    dato.totalGraduacion > 0
      ? Math.min(100, Math.round((dato.totalPagado / dato.totalGraduacion) * 100))
      : 0

  return (
    <>
      <section>
        <h2>Mi progreso</h2>
        <p className="suave">Identificador: {dato.identificador}</p>

        <div
          className="barra"
          role="progressbar"
          aria-valuenow={porcentaje}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div style={{ width: `${porcentaje}%` }} />
        </div>
        <p className="porcentaje">{porcentaje}% pagado</p>

        <div className="cifras">
          <div>
            <span className="suave">Aportado</span>
            <strong>{dinero(dato.totalPagado)}</strong>
          </div>
          <div>
            <span className="suave">Meta</span>
            <strong>{dinero(dato.totalGraduacion)}</strong>
          </div>
          <div>
            <span className="suave">Falta</span>
            <strong>{dinero(Math.max(0, dato.pendiente))}</strong>
          </div>
        </div>
      </section>

      <section>
        <h2>Mis pagos</h2>
        {dato.pagos.length === 0 ? (
          <p className="suave">Aún no tienes pagos registrados.</p>
        ) : (
          <div className="tabla-contenedor">
            <table>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Concepto</th>
                  <th>Monto</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {dato.pagos.map((p, i) => (
                  <tr key={i}>
                    <td>{fechaHora(p.fecha)}</td>
                    <td>{p.concepto}</td>
                    <td>{dinero(p.monto)}</td>
                    <td>{p.estado}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  )
}

function MisAvisos({ token }: { token: string }) {
  const avisos = useLista<Aviso>('/api/Avisos', token)

  return (
    <section>
      <h2>Avisos</h2>
      {avisos.error && <p className="error">{avisos.error}</p>}
      {!avisos.datos && !avisos.error && <p className="suave">Cargando…</p>}
      {avisos.datos && avisos.datos.length === 0 && (
        <p className="suave">No hay avisos por ahora.</p>
      )}
      {avisos.datos?.map((a) => (
        <article key={a.id} className="item">
          <strong>{a.titulo}</strong>
          <p className="mensaje">{a.mensaje}</p>
          <p className="suave">{fechaHora(a.fecha)}</p>
        </article>
      ))}
    </section>
  )
}

function Fecha({ ev }: { ev: Evento }) {
  return (
    <article className={`item ${ev.estado === 'CANCELADO' ? 'inactivo' : ''} ${ev.tipo === 'PAGO' ? 'resalte' : ''}`}>
      <div className="item-cabecera">
        <strong>
          {soloFecha(ev.fecha)} · {ev.titulo}
        </strong>
        <span className="etiqueta">{ev.estado === 'PENDIENTE' ? ev.tipo : ev.estado}</span>
      </div>
      {ev.descripcion && <p className="mensaje">{ev.descripcion}</p>}
    </article>
  )
}

function MisFechas({ token }: { token: string }) {
  const eventos = useLista<Evento>('/api/EventosCalendario', token)
  const [verAnteriores, setVerAnteriores] = useState(false)

  const hoy = hoyISO()
  const todos = eventos.datos ?? []
  const proximos = todos.filter((e) => e.fecha.slice(0, 10) >= hoy)
  const anteriores = todos.filter((e) => e.fecha.slice(0, 10) < hoy).reverse()

  return (
    <section>
      <h2>Próximas fechas</h2>
      {eventos.error && <p className="error">{eventos.error}</p>}
      {!eventos.datos && !eventos.error && <p className="suave">Cargando…</p>}
      {eventos.datos && proximos.length === 0 && (
        <p className="suave">No hay fechas próximas.</p>
      )}
      {proximos.map((ev) => (
        <Fecha key={ev.id} ev={ev} />
      ))}

      {anteriores.length > 0 && (
        <>
          <p>
            <button
              type="button"
              className="enlace"
              onClick={() => setVerAnteriores((v) => !v)}
            >
              {verAnteriores ? 'Ocultar fechas anteriores' : 'Ver fechas anteriores'}
            </button>
          </p>
          {verAnteriores && anteriores.map((ev) => <Fecha key={ev.id} ev={ev} />)}
        </>
      )}
    </section>
  )
}

type Props = { sesion: Sesion; onSalir: () => void }

export default function PanelGraduado({ sesion, onSalir }: Props) {
  return (
    <main className="tarjeta ancha">
      <header className="encabezado">
        <div>
          <h1>Mi graduación</h1>
          <p className="suave">{sesion.email}</p>
        </div>
        <button className="secundario" onClick={onSalir}>
          Cerrar sesión
        </button>
      </header>

      <MiProgreso token={sesion.token} />
      <MisFechas token={sesion.token} />
      <MisAvisos token={sesion.token} />
    </main>
  )
}
