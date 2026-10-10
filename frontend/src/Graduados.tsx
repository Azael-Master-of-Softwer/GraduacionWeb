import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { api, ApiError } from './api'

type Graduado = {
  id: number
  identificador: string
  totalGraduacion: number
  codigoRegistro: string
  applicationUserId: string | null
}

type Creado = {
  identificador: string
  totalGraduacion: number
  codigoRegistro: string
}

type Props = { token: string }

const dinero = (n: number) =>
  n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })

export default function Graduados({ token }: Props) {
  const [lista, setLista] = useState<Graduado[] | null>(null)
  const [errorLista, setErrorLista] = useState('')
  const [version, setVersion] = useState(0)

  const [identificador, setIdentificador] = useState('')
  const [total, setTotal] = useState('')
  const [error, setError] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [creado, setCreado] = useState<Creado | null>(null)
  const [copiado, setCopiado] = useState(false)

  // Carga la lista cada vez que "version" cambia (por ejemplo, al crear uno)
  useEffect(() => {
    let activo = true
    api<Graduado[]>('/api/Graduados', {}, token)
      .then((datos) => {
        if (activo) {
          setLista(datos)
          setErrorLista('')
        }
      })
      .catch((err) => {
        if (activo) {
          setErrorLista(
            err instanceof ApiError ? err.message : 'No se pudo cargar la lista.',
          )
        }
      })
    return () => {
      activo = false
    }
  }, [token, version])

  async function crear(e: FormEvent) {
    e.preventDefault()
    setError('')
    setCreado(null)
    setCopiado(false)

    const totalNumero = Number(total)
    if (!identificador.trim()) {
      setError('Escribe el identificador del graduado.')
      return
    }
    if (!(totalNumero > 0)) {
      setError('El total debe ser mayor a 0.')
      return
    }

    setGuardando(true)
    try {
      const respuesta = await api<Creado>(
        '/api/Graduados',
        {
          method: 'POST',
          body: JSON.stringify({
            identificador: identificador.trim(),
            totalGraduacion: totalNumero,
          }),
        },
        token,
      )
      setCreado(respuesta)
      setIdentificador('')
      setTotal('')
      setVersion((v) => v + 1)
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'No se pudo crear el graduado.',
      )
    } finally {
      setGuardando(false)
    }
  }

  async function copiar(codigo: string) {
    try {
      await navigator.clipboard.writeText(codigo)
      setCopiado(true)
    } catch {
      setCopiado(false)
    }
  }

  return (
    <section>
      <h2>Graduados</h2>

      <form onSubmit={crear} className="fila">
        <label>
          Identificador
          <input
            value={identificador}
            onChange={(e) => setIdentificador(e.target.value)}
            maxLength={50}
            placeholder="Ej. PRUEBA-1"
          />
        </label>
        <label>
          Total a pagar (MXN)
          <input
            type="number"
            min="1"
            step="0.01"
            value={total}
            onChange={(e) => setTotal(e.target.value)}
            placeholder="Ej. 3000"
          />
        </label>
        <button type="submit" disabled={guardando}>
          {guardando ? 'Creando…' : 'Crear graduado'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {creado && (
        <div className="aviso-ok">
          <p>
            Graduado <strong>{creado.identificador}</strong> creado. Entrega este
            código para que se registre:
          </p>
          <p className="codigo">{creado.codigoRegistro}</p>
          <button type="button" onClick={() => copiar(creado.codigoRegistro)}>
            {copiado ? 'Copiado ✓' : 'Copiar código'}
          </button>
        </div>
      )}

      {errorLista && <p className="error">{errorLista}</p>}
      {!lista && !errorLista && (
        <p className="suave">Cargando… la primera vez puede tardar un poco.</p>
      )}

      {lista && lista.length === 0 && (
        <p className="suave">Aún no hay graduados registrados.</p>
      )}

      {lista && lista.length > 0 && (
        <div className="tabla-contenedor">
          <table>
            <thead>
              <tr>
                <th>Identificador</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Código</th>
              </tr>
            </thead>
            <tbody>
              {lista.map((g) => (
                <tr key={g.id}>
                  <td>{g.identificador}</td>
                  <td>{dinero(g.totalGraduacion)}</td>
                  <td>{g.applicationUserId ? 'Registrado' : 'Pendiente'}</td>
                  <td>
                    {g.applicationUserId ? (
                      <span className="suave">—</span>
                    ) : (
                      <code>{g.codigoRegistro}</code>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
