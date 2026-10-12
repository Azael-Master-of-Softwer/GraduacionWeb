import { fechaHora } from './formato'
import type { Aviso } from './useAvisosNuevos'

type Props = { avisos: Aviso[] | null; error: string; visto: number }

export default function AvisosAlumno({ avisos, error, visto }: Props) {
  return (
    <section>
      <h2>Avisos</h2>
      {error && <p className="error">{error}</p>}
      {!avisos && !error && <p className="suave">Cargando…</p>}
      {avisos && avisos.length === 0 && <p className="suave">No hay avisos por ahora.</p>}
      {avisos?.map((a) => (
        <article key={a.id} className="item">
          <div className="item-cabecera">
            <strong>{a.titulo}</strong>
            {a.id > visto && <span className="etiqueta rango">NUEVO</span>}
          </div>
          <p className="mensaje">{a.mensaje}</p>
          <p className="suave">{fechaHora(a.fecha)}</p>
        </article>
      ))}
    </section>
  )
}
