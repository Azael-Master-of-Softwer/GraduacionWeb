import type { ReactNode } from 'react'

export type ItemNavegacion = {
  id: string
  texto: string
  icono: ReactNode
  insignia?: number
}

type Props = {
  items: ItemNavegacion[]
  activo: string
  onElegir: (id: string) => void
}

export default function Navegacion({ items, activo, onElegir }: Props) {
  return (
    <nav className="nav-inferior" aria-label="Secciones">
      <div className="nav-interior" style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}>
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`nav-item ${activo === item.id ? 'activo' : ''}`}
            onClick={() => onElegir(item.id)}
            aria-current={activo === item.id ? 'page' : undefined}
          >
            <span className="nav-icono">
              {item.icono}
              {item.insignia ? <span className="insignia">{item.insignia}</span> : null}
            </span>
            <span className="nav-texto">{item.texto}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}
