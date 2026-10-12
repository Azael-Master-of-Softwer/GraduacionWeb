import { useState } from 'react'
import { hoyISO, soloFecha } from './formato'
import ResumenGeneral from './ResumenGeneral'
import { useLista } from './useLista'

type Evento = {
  id: number
  fecha: string
  titulo: string
  tipo: string
  descripcion: string
  estado: string
}

const DIAS = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
const dos = (n: number) => String(n).padStart(2, '0')

function Detalle({ ev }: { ev: Evento }) {
  return (
    <article
      className={`item ${ev.estado === 'CANCELADO' ? 'inactivo' : ''} ${ev.tipo === 'PAGO' ? 'resalte' : ''}`}
    >
      <div className="item-cabecera">
        <strong>{ev.titulo}</strong>
        <span className="etiqueta">{ev.estado === 'PENDIENTE' ? ev.tipo : ev.estado}</span>
      </div>
      <p className="suave">{soloFecha(ev.fecha)}</p>
      {ev.descripcion && <p className="mensaje">{ev.descripcion}</p>}
    </article>
  )
}

export default function CalendarioAlumno({ token }: { token: string }) {
  const eventos = useLista<Evento>('/api/EventosCalendario', token)
  const hoy = hoyISO()

  const [anio, setAnio] = useState(Number(hoy.slice(0, 4)))
  const [mes, setMes] = useState(Number(hoy.slice(5, 7)) - 1)
  const [elegido, setElegido] = useState<string>(hoy)

  const lista = eventos.datos ?? []
  const porDia = new Map<string, Evento[]>()
  for (const ev of lista) {
    const dia = ev.fecha.slice(0, 10)
    porDia.set(dia, [...(porDia.get(dia) ?? []), ev])
  }

  // La semana empieza en lunes
  const primero = new Date(Date.UTC(anio, mes, 1))
  const desfase = (primero.getUTCDay() + 6) % 7
  const diasDelMes = new Date(Date.UTC(anio, mes + 1, 0)).getUTCDate()
  const textoMes = primero.toLocaleDateString('es-MX', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
  const nombreMes = textoMes.charAt(0).toUpperCase() + textoMes.slice(1)

  function mover(delta: number) {
    const nuevo = new Date(Date.UTC(anio, mes + delta, 1))
    setAnio(nuevo.getUTCFullYear())
    setMes(nuevo.getUTCMonth())
  }

  const celdas: (number | null)[] = [
    ...Array<null>(desfase).fill(null),
    ...Array.from({ length: diasDelMes }, (_, i) => i + 1),
  ]

  const delElegido = porDia.get(elegido) ?? []
  const proximos = [...lista]
    .filter((e) => e.fecha.slice(0, 10) >= hoy && e.estado !== 'CANCELADO')
    .sort((a, b) => a.fecha.localeCompare(b.fecha))
    .slice(0, 5)

  return (
    <>
      <ResumenGeneral token={token} partes="cuenta" />

      <section>
        <h2>Calendario</h2>
        {eventos.error && <p className="error">{eventos.error}</p>}

        <div className="cal-cabecera">
          <button type="button" className="secundario" onClick={() => mover(-1)} aria-label="Mes anterior">
            ‹
          </button>
          <strong className="cal-mes">{nombreMes}</strong>
          <button type="button" className="secundario" onClick={() => mover(1)} aria-label="Mes siguiente">
            ›
          </button>
        </div>

        <div className="cal-rejilla">
          {DIAS.map((d, i) => (
            <span key={i} className="cal-nombre">
              {d}
            </span>
          ))}
          {celdas.map((dia, i) => {
            if (dia === null) return <span key={`v${i}`} />
            const iso = `${anio}-${dos(mes + 1)}-${dos(dia)}`
            const eventosDia = porDia.get(iso) ?? []
            const clases = ['cal-dia']
            if (iso === hoy) clases.push('hoy')
            if (iso === elegido) clases.push('elegido')
            return (
              <button
                key={iso}
                type="button"
                className={clases.join(' ')}
                onClick={() => setElegido(iso)}
                aria-label={`${dia}${eventosDia.length ? `, ${eventosDia.length} actividad(es)` : ''}`}
              >
                <span>{dia}</span>
                <span className="cal-puntos">
                  {eventosDia.slice(0, 3).map((e) => (
                    <i key={e.id} className={e.tipo === 'PAGO' ? 'pago' : ''} />
                  ))}
                </span>
              </button>
            )
          })}
        </div>

        <p className="suave ayuda">
          <span className="punto" style={{ background: 'var(--acento2)' }} /> Fecha de pago ·{' '}
          <span className="punto" style={{ background: 'var(--acento)' }} /> Otra actividad
        </p>

        <h3>{soloFecha(`${elegido}T12:00:00Z`)}</h3>
        {delElegido.length === 0 ? (
          <p className="suave">No hay actividades este día.</p>
        ) : (
          delElegido.map((ev) => <Detalle key={ev.id} ev={ev} />)
        )}
      </section>

      <section>
        <h2>Próximas fechas</h2>
        {eventos.datos && proximos.length === 0 && <p className="suave">No hay fechas próximas.</p>}
        {proximos.map((ev) => (
          <Detalle key={ev.id} ev={ev} />
        ))}
      </section>
    </>
  )
}
