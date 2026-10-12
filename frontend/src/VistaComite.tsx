import { dinero, fechaHora } from './formato'
import ResumenGeneral from './ResumenGeneral'
import { useLista } from './useLista'

type EstadoGraduado = {
  id: number
  identificador: string
  registrado: boolean
  total: number
  pagado: number
}

type Pago = {
  id: number
  identificador: string
  fecha: string
  monto: number
  concepto: string
  estado: string
}

function EstadoGraduados({ token }: { token: string }) {
  const estado = useLista<EstadoGraduado>('/api/Graduados/estado', token)

  return (
    <section>
      <h2>Estado de los graduados</h2>
      {estado.error && <p className="error">{estado.error}</p>}
      {!estado.datos && !estado.error && <p className="suave">Cargando…</p>}
      {estado.datos && estado.datos.length === 0 && (
        <p className="suave">Aún no hay graduados registrados.</p>
      )}
      {estado.datos && estado.datos.length > 0 && (
        <div className="tabla-contenedor">
          <table>
            <thead>
              <tr>
                <th>Graduado</th>
                <th>Cuenta</th>
                <th>Meta</th>
                <th>Pagado</th>
                <th>Falta</th>
              </tr>
            </thead>
            <tbody>
              {estado.datos.map((g) => (
                <tr key={g.id}>
                  <td data-label="Graduado">{g.identificador}</td>
                  <td data-label="Cuenta">{g.registrado ? 'Registrada' : 'Pendiente'}</td>
                  <td data-label="Meta">{dinero(g.total)}</td>
                  <td data-label="Pagado">{dinero(g.pagado)}</td>
                  <td data-label="Falta">{dinero(Math.max(0, g.total - g.pagado))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

function TodosLosPagos({ token }: { token: string }) {
  const pagos = useLista<Pago>('/api/Pagos', token)

  return (
    <section>
      <h2>Pagos registrados</h2>
      {pagos.error && <p className="error">{pagos.error}</p>}
      {!pagos.datos && !pagos.error && <p className="suave">Cargando…</p>}
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
                  <td data-label="Fecha">{fechaHora(p.fecha)}</td>
                  <td data-label="Graduado">{p.identificador}</td>
                  <td data-label="Concepto">{p.concepto}</td>
                  <td data-label="Monto">{dinero(p.monto)}</td>
                  <td data-label="Estado">{p.estado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default function VistaComite({ token }: { token: string }) {
  return (
    <>
      <ResumenGeneral token={token} />
      <EstadoGraduados token={token} />
      <TodosLosPagos token={token} />
    </>
  )
}
