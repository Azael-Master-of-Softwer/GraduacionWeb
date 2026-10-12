import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import BotonTema from './BotonTema.tsx'
import { iniciarTema } from './tema.ts'

iniciarTema()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BotonTema />
    <App />
  </StrictMode>,
)
