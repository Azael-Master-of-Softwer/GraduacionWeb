import { useState } from 'react'
import type { FormEvent } from 'react'
import { api, ApiError } from './api'
import type { Actividad, Movimiento } from './finanzasTipos'
import FinanzasVista from './FinanzasVista'
import type { AccionesFinanzas } from './FinanzasVista'
import { hoyISO } from './formato'
import { useFinanzas } from './useFinanzas'

export default function FinanzasAdmin({ token }: { token: string }) {
  const f = useFinanzas(token)
  const [error, setError] = useState('')
  const [ok, setOk] = useState('')

  // Formulario de actividad
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [meta, setMeta] = useState('')
  const [fechaActividad, setFechaActividad] = useState('')
  const [guardandoActividad, setGuardandoActividad] = useState(false)

  // Formulario de movimiento
  const [tipo, setTipo] = useState('EGRESO')
  const [monto, setMonto] = useState('')
  const [fechaMovimiento, setFechaMovimiento] = useState(hoyISO)
  const [concepto, setConcepto] = useState('')
  const [actividadId, setActividadId] = useState('')
  const [guardandoMovimiento, setGuardandoMovimiento] = useState(false)

  function aviso(texto: string) {
    setError('')
    setOk(texto)
  }

  function fallo(err: unknown, porDefecto: string) {
    setOk('')
    setError(err instanceof ApiError ? err.message : porDefecto)
  }

  async function crearActividad(e: FormEvent) {
    e.preventDefault()
    setError('')
    setOk('')
    if (nombre.trim().length < 3) {
      setError('El nombre de la actividad debe tener al menos 3 caracteres.')
      return
    }
    const metaNumero = meta.trim() === '' ? null : Number(meta)
    if (metaNumero !== null && !(metaNumero > 0)) {
      setError('La meta debe ser mayor a 0.')
      return
    }

    setGuardandoActividad(true)
    try {
      await api(
        '/api/Actividades',
        {
          method: 'POST',
          body: JSON.stringify({
            nombre: nombre.trim(),
            descripcion: descripcion.trim(),
            meta: metaNumero,
            fecha: fechaActividad ? `${fechaActividad}T12:00:00Z` : null,
          }),
        },
        token,
      )
      setNombre('')
      setDescripcion('')
      setMeta('')
      setFechaActividad('')
      aviso('Actividad creada.')
      f.recargar()
    } catch (err) {
      fallo(err, 'No se pudo crear la actividad.')
    } finally {
      setGuardandoActividad(false)
    }
  }

  async function crearMovimiento(e: FormEvent) {
    e.preventDefault()
    setError('')
    setOk('')
    const montoNumero = Number(monto)
    if (!(montoNumero > 0)) {
      setError('El monto debe ser mayor a 0.')
      return
    }
    if (!fechaMovimiento) {
      setError('Elige la fecha.')
      return
    }
    if (concepto.trim().length < 3) {
      setError('El concepto debe tener al menos 3 caracteres.')
      return
    }

    setGuardandoMovimiento(true)
    try {
      await api(
        '/api/Movimientos',
        {
          method: 'POST',
          body: JSON.stringify({
            tipo,
            monto: montoNumero,
            fecha: `${fechaMovimiento}T12:00:00Z`,
            concepto: concepto.trim(),
            actividadId: actividadId ? Number(actividadId) : null,
          }),
        },
        token,
      )
      setMonto('')
      setConcepto('')
      aviso('Movimiento registrado.')
      f.recargar()
    } catch (err) {
      fallo(err, 'No se pudo registrar el movimiento.')
    } finally {
      setGuardandoMovimiento(false)
    }
  }

  const acciones: AccionesFinanzas = {
    async eliminarMovimiento(m: Movimiento) {
      if (!window.confirm(`¿Eliminar el movimiento "${m.concepto}"?`)) return
      try {
        await api(`/api/Movimientos/${m.id}`, { method: 'DELETE' }, token)
        aviso('Movimiento eliminado.')
        f.recargar()
      } catch (err) {
        fallo(err, 'No se pudo eliminar el movimiento.')
      }
    },
    async alternarActividad(a: Actividad) {
      try {
        await api(
          `/api/Actividades/${a.id}`,
          {
            method: 'PUT',
            body: JSON.stringify({
              nombre: a.nombre,
              descripcion: a.descripcion,
              meta: a.meta,
              fecha: a.fecha,
              estado: a.estado === 'ACTIVA' ? 'TERMINADA' : 'ACTIVA',
            }),
          },
          token,
        )
        aviso('Actividad actualizada.')
        f.recargar()
      } catch (err) {
        fallo(err, 'No se pudo actualizar la actividad.')
      }
    },
    async eliminarActividad(a: Actividad) {
      if (!window.confirm(`¿Eliminar la actividad "${a.nombre}"?`)) return
      try {
        await api(`/api/Actividades/${a.id}`, { method: 'DELETE' }, token)
        aviso('Actividad eliminada.')
        f.recargar()
      } catch (err) {
        fallo(err, 'No se pudo eliminar la actividad.')
      }
    },
  }

  return (
    <>
      <section>
        <h2>Registrar movimiento</h2>
        <p className="suave">
          Ingresos de actividades y gastos del grupo. Las aportaciones de los alumnos se
          registran en la pestaña Pagos.
        </p>
        <form onSubmit={crearMovimiento} className="columna">
          <div className="fila">
            <label>
              Tipo
              <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
                <option value="EGRESO">Gasto</option>
                <option value="INGRESO">Ingreso de actividad</option>
              </select>
            </label>
            <label>
              Monto (MXN)
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
              />
            </label>
            <label>
              Fecha
              <input
                type="date"
                value={fechaMovimiento}
                onChange={(e) => setFechaMovimiento(e.target.value)}
              />
            </label>
          </div>
          <label>
            Concepto
            <input
              value={concepto}
              onChange={(e) => setConcepto(e.target.value)}
              maxLength={200}
              placeholder="Ej. Renta del salón"
            />
          </label>
          <label>
            Actividad (opcional)
            <select value={actividadId} onChange={(e) => setActividadId(e.target.value)}>
              <option value="">Sin actividad</option>
              {(f.actividades ?? []).map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nombre}
                </option>
              ))}
            </select>
          </label>
          <div>
            <button type="submit" disabled={guardandoMovimiento}>
              {guardandoMovimiento ? 'Guardando…' : 'Registrar movimiento'}
            </button>
          </div>
        </form>
      </section>

      <section>
        <h2>Nueva actividad</h2>
        <form onSubmit={crearActividad} className="columna">
          <label>
            Nombre
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              maxLength={100}
              placeholder="Ej. Venta de llaveros"
            />
          </label>
          <label>
            Descripción (opcional)
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              maxLength={500}
              rows={2}
            />
          </label>
          <div className="fila">
            <label>
              Meta (opcional)
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={meta}
                onChange={(e) => setMeta(e.target.value)}
              />
            </label>
            <label>
              Fecha (opcional)
              <input
                type="date"
                value={fechaActividad}
                onChange={(e) => setFechaActividad(e.target.value)}
              />
            </label>
          </div>
          <div>
            <button type="submit" disabled={guardandoActividad}>
              {guardandoActividad ? 'Creando…' : 'Crear actividad'}
            </button>
          </div>
        </form>
      </section>

      {error && <p className="error">{error}</p>}
      {ok && <p className="ok">{ok}</p>}

      <FinanzasVista
        resumen={f.resumen}
        actividades={f.actividades}
        movimientos={f.movimientos}
        error={f.error}
        acciones={acciones}
      />
    </>
  )
}
