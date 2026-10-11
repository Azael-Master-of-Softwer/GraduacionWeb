import { useState } from 'react'
import type { FormEvent } from 'react'
import { api, ApiError } from './api'
import { dinero } from './formato'
import type { General } from './ResumenGeneral'
import { useDato } from './useDato'

type FormularioProps = {
  inicial: General
  token: string
  onGuardado: (mensaje: string) => void
}

function Formulario({ inicial, token, onGuardado }: FormularioProps) {
  const [fecha, setFecha] = useState(
    inicial.fechaGraduacion ? inicial.fechaGraduacion.slice(0, 10) : '',
  )
  const [meta, setMeta] = useState(
    inicial.metaPorAlumno != null ? String(inicial.metaPorAlumno) : '',
  )
  const [error, setError] = useState('')
  const [guardando, setGuardando] = useState(false)

  async function guardar(e: FormEvent) {
    e.preventDefault()
    setError('')

    const metaNumero = meta.trim() === '' ? null : Number(meta)
    if (metaNumero !== null && !(metaNumero > 0)) {
      setError('La meta por persona debe ser mayor a 0.')
      return
    }

    const cambiaMeta = metaNumero !== null && metaNumero !== inicial.metaPorAlumno
    if (cambiaMeta && inicial.graduados > 0) {
      const seguro = window.confirm(
        `La meta de TODOS los graduados (${inicial.graduados}) pasará a ser ${dinero(metaNumero)}. ¿Continuar?`,
      )
      if (!seguro) return
    }

    setGuardando(true)
    try {
      const respuesta = await api<{ metaAplicadaATodos: boolean }>(
        '/api/Configuracion',
        {
          method: 'PUT',
          body: JSON.stringify({
            fechaGraduacion: fecha ? `${fecha}T12:00:00Z` : null,
            metaPorAlumno: metaNumero,
          }),
        },
        token,
      )
      onGuardado(
        respuesta.metaAplicadaATodos
          ? 'Guardado. La nueva meta se aplicó a todos los graduados.'
          : 'Guardado.',
      )
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo guardar.')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <form onSubmit={guardar} className="columna">
      <label>
        Fecha de la graduación
        <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
      </label>
      <p className="suave ayuda">Déjala vacía si todavía no se define.</p>

      <label>
        Meta por persona (MXN)
        <input
          type="number"
          min="0.01"
          step="0.01"
          value={meta}
          onChange={(e) => setMeta(e.target.value)}
          placeholder="Ej. 3000"
        />
      </label>
      <p className="suave ayuda">
        Es igual para todos. Al cambiarla, se actualiza la meta de todos los graduados. Si
        creas un graduado sin escribir un total, se usa esta meta.
      </p>

      {error && <p className="error">{error}</p>}

      <div>
        <button type="submit" disabled={guardando}>
          {guardando ? 'Guardando…' : 'Guardar configuración'}
        </button>
      </div>
    </form>
  )
}

export default function Configuracion({ token }: { token: string }) {
  const { dato, error, recargar } = useDato<General>('/api/Configuracion/general', token)
  const [mensaje, setMensaje] = useState('')

  return (
    <section>
      <h2>Configuración</h2>
      {error && <p className="error">{error}</p>}
      {!dato && !error && <p className="suave">Cargando…</p>}
      {mensaje && <p className="ok">{mensaje}</p>}
      {dato && (
        <Formulario
          key={`${dato.fechaGraduacion}-${dato.metaPorAlumno}`}
          inicial={dato}
          token={token}
          onGuardado={(texto) => {
            setMensaje(texto)
            recargar()
          }}
        />
      )}
    </section>
  )
}
