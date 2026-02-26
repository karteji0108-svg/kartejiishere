import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext'
import { RamadanProvider } from './context/RamadanContext'
import { AuthProvider } from './context/AuthContext'

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Force update the service worker
    navigator.serviceWorker.register('./sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);

        // Check for updates immediately
        registration.update();

        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (installingWorker == null) {
            return;
          }
          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                // New update available
                console.log('New content is available and will be used when all tabs for this page are closed.');
                // Optionally force reload here if critical
              } else {
                console.log('Content is cached for offline use.');
              }
            }
          };
        };
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

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
