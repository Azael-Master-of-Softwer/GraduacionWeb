import { useState } from 'react'
import { api, ApiError } from './api'
import { copiarTexto, descargarCsv } from './exportar'

type Entrada = {
  linea: number
  identificador: string
  total: number | null
  error?: string
}

type Resultado = {
  linea: number
  identificador: string
  estado: 'creado' | 'existia' | 'error'
  detalle: string
  codigo?: string
}

// Cada línea: identificador, y opcionalmente el total separado por tabulador o ;
function interpretar(texto: string): Entrada[] {
  const entradas: Entrada[] = []
  const vistos = new Set<string>()

  texto.split(/\r?\n/).forEach((crudo, indice) => {
    const linea = crudo.trim()
    if (!linea) return

    const partes = linea.split(/[\t;]/).map((p) => p.trim())
    const identificador = partes[0] ?? ''
    const totalTexto = partes[1] ?? ''

    if (indice === 0 && identificador.toLowerCase() === 'identificador') return

    const entrada: Entrada = { linea: indice + 1, identificador, total: null }

    if (!identificador) {
      entrada.error = 'Falta el identificador.'
    } else if (identificador.length > 50) {
      entrada.error = 'El identificador pasa de 50 caracteres.'
    } else if (vistos.has(identificador.toLowerCase())) {
      entrada.error = 'Está repetido en la lista.'
    }

    if (!entrada.error && totalTexto) {
      const numero = Number(totalTexto.replace(/[$,\s]/g, ''))
      if (numero > 0) entrada.total = numero
      else entrada.error = 'El total no es válido.'
    }

    vistos.add(identificador.toLowerCase())
    entradas.push(entrada)
  })

  return entradas
}

type Props = { token: string; onTerminado: () => void }

export default function CargaMasiva({ token, onTerminado }: Props) {
  const [texto, setTexto] = useState('')
  const [procesando, setProcesando] = useState(false)
  const [progreso, setProgreso] = useState('')
  const [resultados, setResultados] = useState<Resultado[]>([])
  const [copiado, setCopiado] = useState(false)

  const detectadas = interpretar(texto).length

  async function crear() {
    const entradas = interpretar(texto)
    if (entradas.length === 0) return

    setProcesando(true)
    setResultados([])
    setCopiado(false)
    const salida: Resultado[] = []

    for (let i = 0; i < entradas.length; i++) {
      const e = entradas[i]
      setProgreso(`Creando ${i + 1} de ${entradas.length}…`)

      if (e.error) {
        salida.push({ linea: e.linea, identificador: e.identificador, estado: 'error', detalle: e.error })
        continue
      }

      try {
        const respuesta = await api<{ codigoRegistro: string }>(
          '/api/Graduados',
          {
            method: 'POST',
            body: JSON.stringify({
              identificador: e.identificador,
              ...(e.total !== null ? { totalGraduacion: e.total } : {}),
            }),
          },
          token,
        )
        salida.push({
          linea: e.linea,
          identificador: e.identificador,
          estado: 'creado',
          detalle: 'Creado',
          codigo: respuesta.codigoRegistro,
        })
      } catch (err) {
        if (err instanceof ApiError && err.status === 409) {
          salida.push({ linea: e.linea, identificador: e.identificador, estado: 'existia', detalle: 'Ya existía' })
        } else {
          salida.push({
            linea: e.linea,
            identificador: e.identificador,
            estado: 'error',
            detalle: err instanceof ApiError ? err.message : 'No se pudo conectar con el servidor.',
          })
        }
      }
    }

    setResultados(salida)
    setProgreso('')
    setProcesando(false)
    onTerminado()
  }

  const creados = resultados.filter((r) => r.estado === 'creado')
  const existian = resultados.filter((r) => r.estado === 'existia').length
  const errores = resultados.filter((r) => r.estado === 'error').length

  async function copiarCodigos() {
    const lineas = creados.map((r) => `${r.identificador} — ${r.codigo}`)
    setCopiado(await copiarTexto(lineas.join('\n')))
  }

  function descargar() {
    descargarCsv('codigos-nuevos.csv', [
      ['Identificador', 'Código'],
      ...creados.map((r) => [r.identificador, r.codigo ?? '']),
    ])
  }

  return (
    <div className="aviso-ok">
      <p>
        Escribe o pega una persona por línea. Si copias de Excel, puedes pegar dos columnas:
        identificador y total. Si no pones total, se usa la meta general.
      </p>
      <textarea
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        rows={6}
        placeholder={'Ana Pérez\nLuis Gómez\nMaría López;3500'}
        style={{ width: '100%' }}
        disabled={procesando}
      />
      <div className="acciones">
        <button type="button" onClick={crear} disabled={procesando || detectadas === 0}>
          {procesando ? progreso : `Crear ${detectadas} graduado${detectadas === 1 ? '' : 's'}`}
        </button>
      </div>

      {resultados.length > 0 && (
        <>
          <p className="porcentaje">
            {creados.length} creados · {existian} ya existían · {errores} con error
          </p>

          {creados.length > 0 && (
            <div className="acciones">
              <button type="button" className="secundario" onClick={copiarCodigos}>
                {copiado ? 'Copiado ✓' : 'Copiar los códigos nuevos'}
              </button>
              <button type="button" className="secundario" onClick={descargar}>
                Descargar CSV
              </button>
            </div>
          )}

          <div className="tabla-contenedor">
            <table>
              <thead>
                <tr>
                  <th>Identificador</th>
                  <th>Resultado</th>
                  <th>Código</th>
                </tr>
              </thead>
              <tbody>
                {resultados.map((r) => (
                  <tr key={r.linea}>
                    <td data-label="Identificador">{r.identificador || '(vacío)'}</td>
                    <td data-label="Resultado" className={r.estado === 'error' ? 'gasto' : ''}>
                      {r.detalle}
                    </td>
                    <td data-label="Código">{r.codigo ? <code>{r.codigo}</code> : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
