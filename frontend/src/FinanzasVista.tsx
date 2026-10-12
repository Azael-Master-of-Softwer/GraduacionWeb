import { useState } from 'react'
import type { Actividad, Movimiento, ResumenFinanzas } from './finanzasTipos'
import { dinero, soloFecha } from './formato'

export type AccionesFinanzas = {
  eliminarMovimiento: (m: Movimiento) => void
  alternarActividad: (a: Actividad) => void
  eliminarActividad: (a: Actividad) => void
}

export type ModoFinanzas = 'todo' | 'resumen' | 'movimientos'

type Props = {
  modo?: ModoFinanzas
  resumen: ResumenFinanzas | null
  actividades: Actividad[] | null
  movimientos: Movimiento[] | null
  error: string
  acciones?: AccionesFinanzas
}

function Dona({ aportaciones, actividades }: { aportaciones: number; actividades: number }) {
  const total = aportaciones + actividades
  if (total <= 0) return null

  const radio = 40
  const circunferencia = 2 * Math.PI * radio
  const largo = (aportaciones / total) * circunferencia

  return (
    <div className="dona-contenedor">
      <svg viewBox="0 0 100 100" width="140" height="140" role="img"
        aria-label="Aportaciones de alumnos contra ingresos de actividades">
        <circle cx="50" cy="50" r={radio} fill="none" stroke="var(--acento2)" strokeWidth="16" />
        <circle
          cx="50"
          cy="50"
          r={radio}
          fill="none"
          stroke="var(--acento)"
          strokeWidth="16"
          strokeDasharray={`${largo} ${circunferencia - largo}`}
          transform="rotate(-90 50 50)"
        />
      </svg>
      <ul className="leyenda">
        <li>
          <span className="punto" style={{ background: 'var(--acento)' }} />
          Aportaciones de alumnos
          <strong>{Math.round((aportaciones / total) * 100)}%</strong>
        </li>
        <li>
          <span className="punto" style={{ background: 'var(--acento2)' }} />
          Actividades
          <strong>{Math.round((actividades / total) * 100)}%</strong>
        </li>
      </ul>
    </div>
  )
}

function BarrasActividades({ actividades }: { actividades: Actividad[] }) {
  const conMovimientos = actividades.filter((a) => a.ingresos > 0 || a.egresos > 0)
  if (conMovimientos.length === 0) return null

  const maximo = Math.max(...conMovimientos.map((a) => Math.abs(a.neto)), 1)

  return (
    <>
      <h3>Ganancia neta por actividad</h3>
      {conMovimientos.map((a) => (
        <div key={a.id} className="barra-fila">
          <span className="barra-nombre">{a.nombre}</span>
          <div className="barra-h">
            <div
              className={a.neto < 0 ? 'neg' : ''}
              style={{ width: `${(Math.abs(a.neto) / maximo) * 100}%` }}
            />
          </div>
          <strong className="barra-valor">{dinero(a.neto)}</strong>
        </div>
      ))}
    </>
  )
}

export default function FinanzasVista({
  modo = 'todo',
  resumen,
  actividades,
  movimientos,
  error,
  acciones,
}: Props) {
  const [verDetalle, setVerDetalle] = useState(false)

  const mostrarTabla = modo === 'movimientos' || (modo === 'todo' && verDetalle)

  return (
    <section>
      <h2>{modo === 'movimientos' ? 'Movimientos' : 'Finanzas de la generación'}</h2>
      {error && <p className="error">{error}</p>}
      {!resumen && !error && <p className="suave">Cargando…</p>}

      {modo !== 'movimientos' && resumen && (
        <>
          <div className="cifras cuatro">
            <div>
              <span className="suave">Aportaciones</span>
              <strong>{dinero(resumen.aportaciones)}</strong>
            </div>
            <div>
              <span className="suave">Actividades</span>
              <strong>{dinero(resumen.ingresosActividades)}</strong>
            </div>
            <div>
              <span className="suave">Gastos</span>
              <strong>{dinero(resumen.egresos)}</strong>
            </div>
            <div>
              <span className="suave">Disponible</span>
              <strong>{dinero(resumen.disponible)}</strong>
            </div>
          </div>

          <Dona
            aportaciones={resumen.aportaciones}
            actividades={resumen.ingresosActividades}
          />
        </>
      )}

      {modo !== 'movimientos' && actividades && <BarrasActividades actividades={actividades} />}

      {modo !== 'movimientos' && <h3>Actividades</h3>}
      {modo !== 'movimientos' && actividades && actividades.length === 0 && (
        <p className="suave">Aún no hay actividades registradas.</p>
      )}
      {modo !== 'movimientos' && actividades?.map((a) => (
        <article key={a.id} className={`item ${a.estado === 'ACTIVA' ? '' : 'inactivo'}`}>
          <div className="item-cabecera">
            <strong>{a.nombre}</strong>
            <span className="etiqueta">{a.estado}</span>
          </div>
          {a.descripcion && <p className="mensaje">{a.descripcion}</p>}
          <p className="suave">
            Ingresos {dinero(a.ingresos)} · Gastos {dinero(a.egresos)} · Neto{' '}
            {dinero(a.neto)}
            {a.meta ? ` · Meta ${dinero(a.meta)}` : ''}
            {a.fecha ? ` · ${soloFecha(a.fecha)}` : ''}
          </p>
          {acciones && (
            <div className="acciones">
              <button
                type="button"
                className="secundario"
                onClick={() => acciones.alternarActividad(a)}
              >
                {a.estado === 'ACTIVA' ? 'Marcar terminada' : 'Reactivar'}
              </button>
              <button
                type="button"
                className="peligro"
                onClick={() => acciones.eliminarActividad(a)}
              >
                Eliminar
              </button>
            </div>
          )}
        </article>
      ))}

      {modo === 'todo' && (
        <p>
          <button type="button" className="enlace" onClick={() => setVerDetalle((v) => !v)}>
            {verDetalle ? 'Ocultar el detalle de movimientos' : 'Ver el detalle de movimientos'}
          </button>
        </p>
      )}

      {mostrarTabla && movimientos && movimientos.length === 0 && (
        <p className="suave">Aún no hay movimientos registrados.</p>
      )}

      {mostrarTabla && movimientos && movimientos.length > 0 && (
        <div className="tabla-contenedor">
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Tipo</th>
                <th>Concepto</th>
                <th>Actividad</th>
                <th>Monto</th>
                {acciones && <th></th>}
              </tr>
            </thead>
            <tbody>
              {movimientos.map((m) => (
                <tr key={m.id}>
                  <td data-label="Fecha">{soloFecha(m.fecha)}</td>
                  <td data-label="Tipo">{m.tipo === 'INGRESO' ? 'Ingreso' : 'Gasto'}</td>
                  <td data-label="Concepto">{m.concepto}</td>
                  <td data-label="Actividad">{m.actividad ?? '—'}</td>
                  <td data-label="Monto" className={m.tipo === 'EGRESO' ? 'gasto' : ''}>
                    {m.tipo === 'EGRESO' ? '−' : '+'}
                    {dinero(m.monto)}
                  </td>
                  {acciones && (
                    <td>
                      <button
                        type="button"
                        className="peligro"
                        onClick={() => acciones.eliminarMovimiento(m)}
                      >
                        Eliminar
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
