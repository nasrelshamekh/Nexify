import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HeroUIProvider } from "@heroui/react";
import './index.css'
import App from './App.jsx'
import { ToastContainer } from 'react-toastify';
import AuthContextProvider from './Context/AuthContext.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HeroUIProvider>
      <AuthContextProvider>
        <QueryClientProvider client={queryClient}>
          <ToastContainer />
          <App />
        </QueryClientProvider>
      </AuthContextProvider>
    </HeroUIProvider>
  </StrictMode>,
)
