import { useState } from 'react'
import type { FormEvent } from 'react'
import { api, ApiError } from './api'
import { fechaHora } from './formato'
import { useLista } from './useLista'

type Aviso = {
  id: number
  titulo: string
  mensaje: string
  fecha: string
  estado: string
}

export default function Avisos({ token }: { token: string }) {
  const avisos = useLista<Aviso>('/api/Avisos', token)

  const [titulo, setTitulo] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const [guardando, setGuardando] = useState(false)

  async function crear(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (titulo.trim().length < 3 || mensaje.trim().length < 3) {
      setError('El título y el mensaje deben tener al menos 3 caracteres.')
      return
    }

    setGuardando(true)
    try {
      await api(
        '/api/Avisos',
        {
          method: 'POST',
          body: JSON.stringify({ titulo: titulo.trim(), mensaje: mensaje.trim() }),
        },
        token,
      )
      setTitulo('')
      setMensaje('')
      avisos.recargar()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo crear el aviso.')
    } finally {
      setGuardando(false)
    }
  }

  async function alternar(a: Aviso) {
    setError('')
    try {
      await api(
        `/api/Avisos/${a.id}`,
        {
          method: 'PUT',
          body: JSON.stringify({
            titulo: a.titulo,
            mensaje: a.mensaje,
            estado: a.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO',
          }),
        },
        token,
      )
      avisos.recargar()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo actualizar el aviso.')
    }
  }

  async function eliminar(a: Aviso) {
    if (!window.confirm(`¿Eliminar el aviso "${a.titulo}"?`)) return
    setError('')
    try {
      await api(`/api/Avisos/${a.id}`, { method: 'DELETE' }, token)
      avisos.recargar()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo eliminar el aviso.')
    }
  }

  return (
    <section>
      <h2>Avisos</h2>

      <form onSubmit={crear} className="columna">
        <label>
          Título
          <input
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            maxLength={100}
          />
        </label>
        <label>
          Mensaje
          <textarea
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            maxLength={2000}
            rows={3}
          />
        </label>
        <div>
          <button type="submit" disabled={guardando}>
            {guardando ? 'Publicando…' : 'Publicar aviso'}
          </button>
        </div>
      </form>

      {error && <p className="error">{error}</p>}
      {avisos.error && <p className="error">{avisos.error}</p>}
      {!avisos.datos && !avisos.error && <p className="suave">Cargando…</p>}
      {avisos.datos && avisos.datos.length === 0 && (
        <p className="suave">Aún no hay avisos.</p>
      )}

      {avisos.datos?.map((a) => (
        <article key={a.id} className={`item ${a.estado === 'ACTIVO' ? '' : 'inactivo'}`}>
          <div className="item-cabecera">
            <strong>{a.titulo}</strong>
            <span className="etiqueta">{a.estado}</span>
          </div>
          <p className="mensaje">{a.mensaje}</p>
          <p className="suave">{fechaHora(a.fecha)}</p>
          <div className="acciones">
            <button type="button" className="secundario" onClick={() => alternar(a)}>
              {a.estado === 'ACTIVO' ? 'Desactivar' : 'Activar'}
            </button>
            <button type="button" className="peligro" onClick={() => eliminar(a)}>
              Eliminar
            </button>
          </div>
        </article>
      ))}
    </section>
  )
}
