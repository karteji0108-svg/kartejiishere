import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext'
import { RamadanProvider } from './context/RamadanContext'
import { AuthProvider } from './context/AuthContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <RamadanProvider>
          <App />
        </RamadanProvider>
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>,
)
