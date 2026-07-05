import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { setupInterceptors } from './api/interceptors'
import { App } from './app/App'
import { AppProviders } from './app/providers'
import './index.css'

setupInterceptors()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>,
)
