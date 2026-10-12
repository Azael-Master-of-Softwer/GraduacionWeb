import { useState } from 'react'
import type { FormEvent } from 'react'
import { api, ApiError } from './api'
import CargaMasiva from './CargaMasiva'
import { copiarTexto, descargarCsv, mensajeDeCodigo } from './exportar'
import { dinero } from './formato'
import { useLista } from './useLista'

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

export default function Graduados({ token }: Props) {
  const lista = useLista<Graduado>('/api/Graduados', token)

  const [identificador, setIdentificador] = useState('')
  const [total, setTotal] = useState('')
  const [error, setError] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [creado, setCreado] = useState<Creado | null>(null)
  const [copiadoId, setCopiadoId] = useState<string>('')
  const [verMasivo, setVerMasivo] = useState(false)

  async function crear(e: FormEvent) {
    e.preventDefault()
    setError('')
    setCreado(null)
    setCopiadoId('')

    const totalNumero = total.trim() === '' ? null : Number(total)
    if (!identificador.trim()) {
      setError('Escribe el identificador del graduado.')
      return
    }
    if (totalNumero !== null && !(totalNumero > 0)) {
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
            ...(totalNumero !== null ? { totalGraduacion: totalNumero } : {}),
          }),
        },
        token,
      )
      setCreado(respuesta)
      setIdentificador('')
      setTotal('')
      lista.recargar()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo crear el graduado.')
    } finally {
      setGuardando(false)
    }
  }

  async function copiar(clave: string, texto: string) {
    if (await copiarTexto(texto)) setCopiadoId(clave)
  }

  const graduados = lista.datos ?? []
  const pendientes = graduados.filter((g) => !g.applicationUserId)

  function descargarTodos() {
    descargarCsv('graduados.csv', [
      ['Identificador', 'Total', 'Estado', 'Código'],
      ...graduados.map((g) => [
        g.identificador,
        String(g.totalGraduacion),
        g.applicationUserId ? 'Registrado' : 'Pendiente',
        g.applicationUserId ? '' : g.codigoRegistro,
      ]),
    ])
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
            placeholder="Ej. Ana Pérez"
          />
        </label>
        <label>
          Total a pagar (MXN), opcional
          <input
            type="number"
            min="1"
            step="0.01"
            value={total}
            onChange={(e) => setTotal(e.target.value)}
            placeholder="Vacío = meta general"
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
            Graduado <strong>{creado.identificador}</strong> creado. Entrega este código
            para que se registre:
          </p>
          <p className="codigo">{creado.codigoRegistro}</p>
          <button
            type="button"
            onClick={() => copiar('nuevo', mensajeDeCodigo(creado.codigoRegistro))}
          >
            {copiadoId === 'nuevo' ? 'Copiado ✓' : 'Copiar mensaje con el código'}
          </button>
        </div>
      )}

      <p>
        <button type="button" className="enlace" onClick={() => setVerMasivo((v) => !v)}>
          {verMasivo ? 'Ocultar la carga de varios' : 'Cargar varios graduados a la vez'}
        </button>
      </p>
      {verMasivo && <CargaMasiva token={token} onTerminado={lista.recargar} />}

      {lista.error && <p className="error">{lista.error}</p>}
      {!lista.datos && !lista.error && (
        <p className="suave">Cargando… la primera vez puede tardar un poco.</p>
      )}

      {lista.datos && lista.datos.length === 0 && (
        <p className="suave">Aún no hay graduados registrados.</p>
      )}

      {lista.datos && lista.datos.length > 0 && (
        <>
          <div className="acciones">
            <button
              type="button"
              className="secundario"
              disabled={pendientes.length === 0}
              onClick={() =>
                copiar(
                  'todos',
                  pendientes.map((g) => `${g.identificador} — ${g.codigoRegistro}`).join('\n'),
                )
              }
            >
              {copiadoId === 'todos'
                ? 'Copiado ✓'
                : `Copiar los ${pendientes.length} códigos pendientes`}
            </button>
            <button type="button" className="secundario" onClick={descargarTodos}>
              Descargar CSV
            </button>
          </div>

          <div className="tabla-contenedor">
            <table>
              <thead>
                <tr>
                  <th>Identificador</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Código</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {lista.datos.map((g) => (
                  <tr key={g.id}>
                    <td data-label="Identificador">{g.identificador}</td>
                    <td data-label="Total">{dinero(g.totalGraduacion)}</td>
                    <td data-label="Estado">{g.applicationUserId ? 'Registrado' : 'Pendiente'}</td>
                    <td data-label="Código">
                      {g.applicationUserId ? (
                        <span className="suave">—</span>
                      ) : (
                        <code>{g.codigoRegistro}</code>
                      )}
                    </td>
                    <td className="celda-accion">
                      {!g.applicationUserId && (
                        <button
                          type="button"
                          className="secundario"
                          onClick={() => copiar(`g${g.id}`, mensajeDeCodigo(g.codigoRegistro))}
                        >
                          {copiadoId === `g${g.id}` ? 'Copiado ✓' : 'Copiar mensaje'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  )
}
