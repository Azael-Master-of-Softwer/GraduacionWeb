import type { ReactNode } from 'react'
import BotonTema from './BotonTema'
import { IconoAvisos, IconoBirrete, IconoCalendario, IconoFinanzas } from './iconos'

// Pantalla de inicio de sesión y registro:
// en computadora se divide en portada (izquierda) y formulario (derecha).
export default function PantallaAcceso({ children }: { children: ReactNode }) {
  return (
    <div className="acceso">
      <aside className="acceso-portada">
        <div className="marca">
          <span className="marca-logo">
            <IconoBirrete />
          </span>
          <strong>Graduación</strong>
        </div>

        <div className="portada-texto">
          <h2>Toda tu graduación, en un solo lugar.</h2>
          <p>
            Consulta tus aportaciones, las fechas importantes y los avisos del comité sin
            perderte nada.
          </p>
          <ul className="portada-lista">
            <li>
              <IconoFinanzas /> Tus pagos y lo que falta para la meta
            </li>
            <li>
              <IconoCalendario /> Calendario con las fechas clave
            </li>
            <li>
              <IconoAvisos /> Avisos del comité al momento
            </li>
          </ul>
        </div>

        <IconoBirrete tamano={260} />
      </aside>

      <main className="acceso-formulario">
        <BotonTema />
        <div className="acceso-caja">{children}</div>
      </main>
    </div>
  )
}
