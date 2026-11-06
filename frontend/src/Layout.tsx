import type { ReactNode } from 'react'
import BotonTema from './BotonTema'
import { IconoBirrete, IconoSalir } from './iconos'
import Navegacion from './Navegacion'
import type { ItemNavegacion } from './Navegacion'
import { rango } from './session'
import type { Sesion } from './session'

export type ItemMenu = ItemNavegacion & { descripcion?: string }

type Props = {
  panel: string
  sesion: Sesion
  onSalir: () => void
  items: ItemMenu[]
  activo: string
  onElegir: (id: string) => void
  dosColumnas?: boolean
  children: ReactNode
}

// Estructura de la página una vez dentro:
// - Computadora: menú lateral fijo + barra superior + contenido amplio.
// - Celular: barra superior compacta + menú inferior.
export default function Layout({
  panel,
  sesion,
  onSalir,
  items,
  activo,
  onElegir,
  dosColumnas,
  children,
}: Props) {
  const actual = items.find((i) => i.id === activo)
  const inicial = (sesion.email[0] ?? '?').toUpperCase()

  return (
    <div className="app">
      <aside className="lateral">
        <div className="marca">
          <span className="marca-logo">
            <IconoBirrete />
          </span>
          <div>
            <strong>Graduación</strong>
            <small>{panel}</small>
          </div>
        </div>

        <nav className="menu" aria-label="Secciones">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`menu-item ${activo === item.id ? 'activo' : ''}`}
              onClick={() => onElegir(item.id)}
              aria-current={activo === item.id ? 'page' : undefined}
            >
              <span className="menu-icono">{item.icono}</span>
              <span className="menu-texto">{item.texto}</span>
              {item.insignia ? <span className="menu-insignia">{item.insignia}</span> : null}
            </button>
          ))}
        </nav>

        <div className="lateral-pie">
          <div className="perfil">
            <span className="avatar" aria-hidden="true">
              {inicial}
            </span>
            <div className="perfil-datos">
              <span className="perfil-correo" title={sesion.email}>
                {sesion.email}
              </span>
              <span className="etiqueta rango">{rango(sesion.roles)}</span>
            </div>
          </div>
          <div className="lateral-acciones">
            <BotonTema />
            <button type="button" className="secundario salir" onClick={onSalir}>
              <IconoSalir />
              Cerrar sesión
            </button>
          </div>
        </div>
      </aside>

      <div className="principal">
        <header className="barra-superior">
          <div className="barra-titulo">
            <span className="marca-logo solo-movil">
              <IconoBirrete />
            </span>
            <div>
              <h1>{actual?.texto ?? panel}</h1>
              {actual?.descripcion && <p className="suave">{actual.descripcion}</p>}
            </div>
          </div>
          <div className="barra-acciones solo-movil">
            <BotonTema />
            <button
              type="button"
              className="secundario icono-solo"
              onClick={onSalir}
              aria-label="Cerrar sesión"
              title="Cerrar sesión"
            >
              <IconoSalir />
            </button>
          </div>
        </header>

        <main className={`contenido ${dosColumnas ? 'dos-columnas' : ''}`}>{children}</main>
      </div>

      <Navegacion items={items} activo={activo} onElegir={onElegir} />
    </div>
  )
}
