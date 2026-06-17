import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { LanguageProvider } from './context/LanguageContext'
import { SeasonProvider } from './context/SeasonContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <SeasonProvider>
          <App />
        </SeasonProvider>
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>,
)
