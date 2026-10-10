import { useState } from 'react'
import type { FormEvent } from 'react'
import { api, ApiError } from './api'
import { soloFecha } from './formato'
import { useLista } from './useLista'

type Evento = {
  id: number
  fecha: string
  titulo: string
  tipo: string
  descripcion: string
  estado: string
}

const TIPOS = ['PAGO', 'REUNION', 'EVENTO', 'OTRO']
const ESTADOS = ['PENDIENTE', 'COMPLETADO', 'CANCELADO']

export default function Eventos({ token }: { token: string }) {
  const eventos = useLista<Evento>('/api/EventosCalendario', token)

  const [fecha, setFecha] = useState('')
  const [titulo, setTitulo] = useState('')
  const [tipo, setTipo] = useState('PAGO')
  const [descripcion, setDescripcion] = useState('')
  const [error, setError] = useState('')
  const [guardando, setGuardando] = useState(false)

  async function crear(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (!fecha) {
      setError('Elige la fecha del evento.')
      return
    }
    if (titulo.trim().length < 3) {
      setError('El título debe tener al menos 3 caracteres.')
      return
    }

    setGuardando(true)
    try {
      await api(
        '/api/EventosCalendario',
        {
          method: 'POST',
          body: JSON.stringify({
            fecha: `${fecha}T12:00:00Z`,
            titulo: titulo.trim(),
            tipo,
            descripcion: descripcion.trim(),
          }),
        },
        token,
      )
      setFecha('')
      setTitulo('')
      setDescripcion('')
      eventos.recargar()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo crear el evento.')
    } finally {
      setGuardando(false)
    }
  }

  async function cambiarEstado(ev: Evento, estado: string) {
    setError('')
    try {
      await api(
        `/api/EventosCalendario/${ev.id}`,
        {
          method: 'PUT',
          body: JSON.stringify({
            fecha: ev.fecha,
            titulo: ev.titulo,
            tipo: ev.tipo,
            descripcion: ev.descripcion,
            estado,
          }),
        },
        token,
      )
      eventos.recargar()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo actualizar el evento.')
    }
  }

  async function eliminar(ev: Evento) {
    if (!window.confirm(`¿Eliminar el evento "${ev.titulo}"?`)) return
    setError('')
    try {
      await api(`/api/EventosCalendario/${ev.id}`, { method: 'DELETE' }, token)
      eventos.recargar()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo eliminar el evento.')
    }
  }

  return (
    <section>
      <h2>Calendario</h2>

      <form onSubmit={crear} className="columna">
        <div className="fila">
          <label>
            Fecha
            <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
          </label>
          <label>
            Tipo
            <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
              {TIPOS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label>
          Título
          <input
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            maxLength={100}
            placeholder="Ej. Pago de la segunda cuota"
          />
        </label>
        <label>
          Descripción (opcional)
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            maxLength={1000}
            rows={2}
          />
        </label>
        <div>
          <button type="submit" disabled={guardando}>
            {guardando ? 'Guardando…' : 'Agregar al calendario'}
          </button>
        </div>
      </form>

      {error && <p className="error">{error}</p>}
      {eventos.error && <p className="error">{eventos.error}</p>}
      {!eventos.datos && !eventos.error && <p className="suave">Cargando…</p>}
      {eventos.datos && eventos.datos.length === 0 && (
        <p className="suave">Aún no hay eventos en el calendario.</p>
      )}

      {eventos.datos?.map((ev) => (
        <article key={ev.id} className="item">
          <div className="item-cabecera">
            <strong>
              {soloFecha(ev.fecha)} · {ev.titulo}
            </strong>
            <span className="etiqueta">{ev.tipo}</span>
          </div>
          {ev.descripcion && <p className="mensaje">{ev.descripcion}</p>}
          <div className="acciones">
            <select
              value={ev.estado}
              onChange={(e) => cambiarEstado(ev, e.target.value)}
              aria-label="Estado del evento"
            >
              {ESTADOS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <button type="button" className="peligro" onClick={() => eliminar(ev)}>
              Eliminar
            </button>
          </div>
        </article>
      ))}
    </section>
  )
}
