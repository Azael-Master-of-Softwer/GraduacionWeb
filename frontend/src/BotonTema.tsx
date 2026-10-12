import { useState } from 'react'
import { aplicarTema, guardarTema, temaDelSistema, temaGuardado } from './tema'
import type { Tema } from './tema'

function Sol() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  )
}

function Luna() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

export default function BotonTema() {
  const [tema, setTema] = useState<Tema>(() => temaGuardado() ?? temaDelSistema())

  function alternar() {
    const nuevo: Tema = tema === 'oscuro' ? 'claro' : 'oscuro'
    aplicarTema(nuevo)
    guardarTema(nuevo)
    setTema(nuevo)
  }

  const texto = tema === 'oscuro' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'

  return (
    <button type="button" className="tema" onClick={alternar} aria-label={texto} title={texto}>
      {tema === 'oscuro' ? <Sol /> : <Luna />}
    </button>
  )
}
