import React from 'react'
import ReactDOM from 'react-dom/client'
import theme from './theme.ts'
import './index.css'
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react"
import 'bootstrap/dist/css/bootstrap.css'
import './i18n.ts'
import { RouterProvider } from 'react-router-dom'
import router from './routes.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()
import './fonts/Moul-Regular.ttf'
import './fonts/Ultra-Regular.ttf'



ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <QueryClientProvider client={queryClient}>
              <RouterProvider router={router} />
      </QueryClientProvider>
    </ChakraProvider>
  </React.StrictMode>,
)

