import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import theme from './theme.ts'
import './index.css'
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react"
import 'bootstrap/dist/css/bootstrap.css'

import './i18n.ts'
import { ThemeProvider, createTheme } from '@mui/material'
const muiTheme = createTheme()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={muiTheme}>
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <App />
      </ChakraProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
