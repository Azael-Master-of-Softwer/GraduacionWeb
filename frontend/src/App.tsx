import { useState } from 'react'
import Login from './Login'
import {
  borrarSesion,
  cargarSesion,
  crearSesion,
  guardarToken,
} from './session'
import type { Sesion } from './session'

export default function App() {
  const [sesion, setSesion] = useState<Sesion | null>(cargarSesion)

  function iniciar(token: string) {
    const nueva = crearSesion(token)
    if (nueva) {
      guardarToken(token)
      setSesion(nueva)
    }
  }

  function salir() {
    borrarSesion()
    setSesion(null)
  }

  if (!sesion) return <Login onLogin={iniciar} />

  return (
    <main className="tarjeta">
      <h1>Graduación</h1>
      <p>
        Sesión iniciada como <strong>{sesion.email}</strong>
      </p>
      <p className="suave">
        Rol: {sesion.roles.length ? sesion.roles.join(', ') : 'sin rol'}
      </p>
      <button onClick={salir}>Cerrar sesión</button>
    </main>
  )
}
