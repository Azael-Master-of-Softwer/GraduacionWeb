import { useState } from 'react'
import { api, ApiError } from './api'
import { rango } from './session'
import { useLista } from './useLista'

type Usuario = {
  id: string
  nombre: string
  email: string
  roles: string[]
  identificador: string | null
}

export default function Usuarios({ token }: { token: string }) {
  const usuarios = useLista<Usuario>('/api/Usuarios', token)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')

  async function cambiar(u: Usuario, esComite: boolean) {
    const texto = esComite
      ? `¿Hacer parte del Comité a ${u.nombre}?`
      : `¿Quitar del Comité a ${u.nombre}?`
    if (!window.confirm(texto)) return

    setError('')
    setMensaje('')
    try {
      await api(
        `/api/Usuarios/${u.id}/comite`,
        { method: 'PUT', body: JSON.stringify({ esComite }) },
        token,
      )
      setMensaje(
        'Listo. El cambio se aplica la próxima vez que esa persona inicie sesión.',
      )
      usuarios.recargar()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo cambiar el rango.')
    }
  }

  return (
    <section>
      <h2>Usuarios</h2>
      <p className="suave">
        Aquí decides quiénes forman parte del Comité. El Admin no se puede cambiar desde
        la página.
      </p>

      {error && <p className="error">{error}</p>}
      {mensaje && <p className="ok">{mensaje}</p>}
      {usuarios.error && <p className="error">{usuarios.error}</p>}
      {!usuarios.datos && !usuarios.error && <p className="suave">Cargando…</p>}
      {usuarios.datos && usuarios.datos.length === 0 && (
        <p className="suave">Aún no hay usuarios.</p>
      )}

      {usuarios.datos?.map((u) => {
        const esAdmin = u.roles.includes('ADMIN')
        const esComite = u.roles.includes('COMITE')

        return (
          <article key={u.id} className="item">
            <div className="item-cabecera">
              <strong>{u.nombre}</strong>
              <span className="etiqueta rango">{rango(u.roles)}</span>
            </div>
            <p className="suave">{u.email}</p>
            {u.identificador && <p className="suave">Graduado: {u.identificador}</p>}
            {!esAdmin && (
              <div className="acciones">
                <button
                  type="button"
                  className="secundario"
                  onClick={() => cambiar(u, !esComite)}
                >
                  {esComite ? 'Quitar del Comité' : 'Hacer del Comité'}
                </button>
              </div>
            )}
          </article>
        )
      })}
    </section>
  )
}
