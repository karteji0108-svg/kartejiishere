import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext'
import { RamadanProvider } from './context/RamadanContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <RamadanProvider>
        <App />
      </RamadanProvider>
    </ThemeProvider>
  </StrictMode>,
)
