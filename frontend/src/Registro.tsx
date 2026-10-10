import { useState } from 'react'
import type { FormEvent } from 'react'
import { api, ApiError } from './api'
import CampoContrasena from './CampoContrasena'

type Props = {
  onRegistrado: (token: string) => void
  onIrALogin: () => void
}

export default function Registro({ onRegistrado, onIrALogin }: Props) {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [codigo, setCodigo] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  async function enviar(e: FormEvent) {
    e.preventDefault()
    setError('')

    if (password !== confirmar) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setCargando(true)
    try {
      await api('/api/Auth/registro', {
        method: 'POST',
        body: JSON.stringify({
          nombre: nombre.trim(),
          email: email.trim(),
          password,
          codigoRegistro: codigo.trim(),
        }),
      })
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'No se pudo conectar con el servidor. Inténtalo de nuevo.',
      )
      setCargando(false)
      return
    }

    // La cuenta ya existe: se inicia sesión automáticamente
    try {
      const respuesta = await api<{ token: string }>('/api/Auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim(), password }),
      })
      onRegistrado(respuesta.token)
    } catch {
      setError('Tu cuenta se creó correctamente. Ahora inicia sesión.')
      setCargando(false)
    }
  }

  return (
    <main className="tarjeta">
      <h1>Crear mi cuenta</h1>
      <p className="suave">Necesitas el código de registro que te dio el comité.</p>

      <form onSubmit={enviar}>
        <label>
          Código de registro
          <input
            value={codigo}
            onChange={(e) => setCodigo(e.target.value.toUpperCase())}
            maxLength={20}
            autoComplete="off"
            required
          />
        </label>

        <label>
          Nombre
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            maxLength={100}
            autoComplete="name"
            required
          />
        </label>

        <label>
          Correo
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </label>

        <label>
          Contraseña
          <CampoContrasena
            value={password}
            onChange={setPassword}
            autoComplete="new-password"
            minLength={6}
          />
        </label>
        <p className="suave ayuda">
          Mínimo 6 caracteres, con mayúscula, minúscula, número y un símbolo.
        </p>

        <label>
          Confirmar contraseña
          <CampoContrasena
            value={confirmar}
            onChange={setConfirmar}
            autoComplete="new-password"
          />
        </label>

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={cargando}>
          {cargando ? 'Creando cuenta…' : 'Crear cuenta'}
        </button>

        {cargando && (
          <p className="suave">
            La primera vez del día puede tardar hasta un minuto en responder.
          </p>
        )}
      </form>

      <p className="suave pie">
        ¿Ya tienes cuenta?{' '}
        <button type="button" className="enlace" onClick={onIrALogin}>
          Iniciar sesión
        </button>
      </p>
    </main>
  )
}
