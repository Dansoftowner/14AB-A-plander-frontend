import React from 'react'
import ReactDOM from 'react-dom/client'
import theme from './theme.ts'
import './index.css'
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react"
import 'bootstrap/dist/css/bootstrap.css'
import './i18n.ts'
import { RouterProvider } from 'react-router-dom'
import router from './routes.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>

    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <RouterProvider router={router} />
    </ChakraProvider>
  </React.StrictMode>,
)

