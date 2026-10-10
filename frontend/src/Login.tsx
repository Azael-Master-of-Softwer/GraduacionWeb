import { useState } from 'react'
import type { FormEvent } from 'react'
import { api, ApiError } from './api'

type Props = { onLogin: (token: string) => void }

export default function Login({ onLogin }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  async function enviar(e: FormEvent) {
    e.preventDefault()
    setError('')
    setCargando(true)
    try {
      const respuesta = await api<{ token: string }>('/api/Auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })
      onLogin(respuesta.token)
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'No se pudo conectar con el servidor. Inténtalo de nuevo.',
      )
    } finally {
      setCargando(false)
    }
  }

  return (
    <main className="tarjeta">
      <h1>Graduación</h1>
      <p className="suave">Inicia sesión para ver tu información.</p>

      <form onSubmit={enviar}>
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
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={cargando}>
          {cargando ? 'Entrando…' : 'Entrar'}
        </button>

        {cargando && (
          <p className="suave">
            La primera vez del día puede tardar hasta un minuto en responder.
          </p>
        )}
      </form>
    </main>
  )
}
