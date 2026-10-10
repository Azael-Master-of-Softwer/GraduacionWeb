import { useState } from 'react'
import type { FormEvent } from 'react'
import { api, ApiError } from './api'
import { dinero, fechaHora } from './formato'
import { useLista } from './useLista'

type GraduadoOpcion = { id: number; identificador: string }

type Pago = {
  id: number
  graduadoId: number
  identificador: string
  fecha: string
  monto: number
  concepto: string
  estado: string
}

export default function Pagos({ token }: { token: string }) {
  const graduados = useLista<GraduadoOpcion>('/api/Graduados', token)
  const pagos = useLista<Pago>('/api/Pagos', token)

  const [graduadoId, setGraduadoId] = useState('')
  const [monto, setMonto] = useState('')
  const [concepto, setConcepto] = useState('')
  const [error, setError] = useState('')
  const [ok, setOk] = useState('')
  const [guardando, setGuardando] = useState(false)

  async function registrar(e: FormEvent) {
    e.preventDefault()
    setError('')
    setOk('')

    const montoNumero = Number(monto)
    if (!graduadoId) {
      setError('Elige un graduado.')
      return
    }
    if (!(montoNumero > 0)) {
      setError('El monto debe ser mayor a 0.')
      return
    }
    if (!concepto.trim()) {
      setError('Escribe el concepto del pago.')
      return
    }

    setGuardando(true)
    try {
      await api(
        '/api/Pagos',
        {
          method: 'POST',
          body: JSON.stringify({
            graduadoId: Number(graduadoId),
            monto: montoNumero,
            concepto: concepto.trim(),
          }),
        },
        token,
      )
      setOk('Pago registrado.')
      setMonto('')
      setConcepto('')
      pagos.recargar()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo registrar el pago.')
    } finally {
      setGuardando(false)
    }
  }

  const totalConfirmado = (pagos.datos ?? [])
    .filter((p) => p.estado === 'CONFIRMADO')
    .reduce((suma, p) => suma + p.monto, 0)

  return (
    <section>
      <h2>Pagos</h2>

      <form onSubmit={registrar} className="fila">
        <label>
          Graduado
          <select value={graduadoId} onChange={(e) => setGraduadoId(e.target.value)}>
            <option value="">Elige…</option>
            {(graduados.datos ?? []).map((g) => (
              <option key={g.id} value={g.id}>
                {g.identificador}
              </option>
            ))}
          </select>
        </label>
        <label>
          Monto (MXN)
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            placeholder="Ej. 500"
          />
        </label>
        <label>
          Concepto
          <input
            value={concepto}
            onChange={(e) => setConcepto(e.target.value)}
            maxLength={200}
            placeholder="Ej. Primera cuota"
          />
        </label>
        <button type="submit" disabled={guardando}>
          {guardando ? 'Guardando…' : 'Registrar pago'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}
      {ok && <p className="ok">{ok}</p>}
      {graduados.error && <p className="error">{graduados.error}</p>}

      {pagos.error && <p className="error">{pagos.error}</p>}
      {!pagos.datos && !pagos.error && <p className="suave">Cargando…</p>}

      {pagos.datos && (
        <p className="resumen-total">
          Total recaudado: <strong>{dinero(totalConfirmado)}</strong>
        </p>
      )}

      {pagos.datos && pagos.datos.length === 0 && (
        <p className="suave">Aún no hay pagos registrados.</p>
      )}

      {pagos.datos && pagos.datos.length > 0 && (
        <div className="tabla-contenedor">
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Graduado</th>
                <th>Concepto</th>
                <th>Monto</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {pagos.datos.map((p) => (
                <tr key={p.id}>
                  <td>{fechaHora(p.fecha)}</td>
                  <td>{p.identificador}</td>
                  <td>{p.concepto}</td>
                  <td>{dinero(p.monto)}</td>
                  <td>{p.estado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
