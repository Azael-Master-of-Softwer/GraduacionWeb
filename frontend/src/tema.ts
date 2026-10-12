export type Tema = 'claro' | 'oscuro'

const CLAVE = 'graduacion_tema'

export function temaGuardado(): Tema | null {
  try {
    const valor = localStorage.getItem(CLAVE)
    return valor === 'claro' || valor === 'oscuro' ? valor : null
  } catch {
    return null
  }
}

export function temaDelSistema(): Tema {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'oscuro' : 'claro'
}

export function aplicarTema(tema: Tema) {
  document.documentElement.dataset.tema = tema
}

export function guardarTema(tema: Tema) {
  try {
    localStorage.setItem(CLAVE, tema)
  } catch {
    // Si el navegador no deja guardar, el cambio vale solo para esta visita
  }
}

// Al abrir la página: si la persona ya eligió un modo, se aplica
export function iniciarTema() {
  const guardado = temaGuardado()
  if (guardado) aplicarTema(guardado)
}
