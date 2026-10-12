import { dinero, fechaHora } from './formato'
import { useDato } from './useDato'

type PagoResumen = {
  fecha: string
  monto: number
  concepto: string
  estado: string
}

type Resumen = {
  identificador: string
  totalGraduacion: number
  totalPagado: number
  pendiente: number
  pagos: PagoResumen[]
}

export default function InicioAlumno({ token }: { token: string }) {
  const { dato, error } = useDato<Resumen>('/api/Graduados/mi-resumen', token)

  if (error) {
    return (
      <section>
        <h2>Mi progreso</h2>
        <p className="error">{error}</p>
      </section>
    )
  }

  if (!dato) {
    return (
      <section>
        <h2>Mi progreso</h2>
        <p className="suave">Cargando… la primera vez puede tardar un poco.</p>
      </section>
    )
  }

  const porcentaje =
    dato.totalGraduacion > 0
      ? Math.min(100, Math.round((dato.totalPagado / dato.totalGraduacion) * 100))
      : 0

  return (
    <>
      <section>
        <h2>Mi progreso</h2>
        <p className="suave">Identificador: {dato.identificador}</p>

        <div
          className="barra"
          role="progressbar"
          aria-valuenow={porcentaje}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div style={{ width: `${porcentaje}%` }} />
        </div>
        <p className="porcentaje">{porcentaje}% pagado</p>

        <div className="cifras">
          <div>
            <span className="suave">Aportado</span>
            <strong>{dinero(dato.totalPagado)}</strong>
          </div>
          <div>
            <span className="suave">Meta</span>
            <strong>{dinero(dato.totalGraduacion)}</strong>
          </div>
          <div>
            <span className="suave">Falta</span>
            <strong>{dinero(Math.max(0, dato.pendiente))}</strong>
          </div>
        </div>
      </section>

      <section>
        <h2>Mis pagos</h2>
        {dato.pagos.length === 0 ? (
          <p className="suave">Aún no tienes pagos registrados.</p>
        ) : (
          <div className="tabla-contenedor">
            <table>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Concepto</th>
                  <th>Monto</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {dato.pagos.map((p, i) => (
                  <tr key={i}>
                    <td data-label="Fecha">{fechaHora(p.fecha)}</td>
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
    </>
  )
}
