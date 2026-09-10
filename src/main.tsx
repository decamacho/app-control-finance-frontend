import { QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { App as AntApp } from 'antd'
import './index.css'
import App from './App.tsx'
import { queryClient } from './presentation/query/queryClient.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AntApp>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AntApp>
    </QueryClientProvider>
  </StrictMode>,
)
