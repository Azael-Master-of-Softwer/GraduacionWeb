import { useState } from 'react'
import Login from './Login'
import PanelAdmin from './PanelAdmin'
import PanelGraduado from './PanelGraduado'
import Registro from './Registro'
import {
  borrarSesion,
  cargarSesion,
  crearSesion,
  guardarToken,
} from './session'
import type { Sesion } from './session'

export default function App() {
  const [sesion, setSesion] = useState<Sesion | null>(cargarSesion)
  const [modo, setModo] = useState<'login' | 'registro'>('login')

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
    setModo('login')
  }

  if (!sesion) {
    return modo === 'registro' ? (
      <Registro onRegistrado={iniciar} onIrALogin={() => setModo('login')} />
    ) : (
      <Login onLogin={iniciar} onIrARegistro={() => setModo('registro')} />
    )
  }

  if (sesion.roles.includes('ADMIN')) {
    return <PanelAdmin sesion={sesion} onSalir={salir} />
  }

  return <PanelGraduado sesion={sesion} onSalir={salir} />
}
