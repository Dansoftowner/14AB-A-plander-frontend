import { ThemeConfig,extendTheme } from "@chakra-ui/react";

const config : ThemeConfig = {
    initialColorMode: 'dark',
}

const theme = extendTheme({
    config,
    colors:{
        yellow:{
            50: '#fef5b7',
            100: '#fef194',
            200: '#fdec70',
            300: '#fde74c',
            400: '#cab93d',
            500: '#988b2e',
            600: '#655c1e'
        },
        lightblue: {
            50: '#d7faf9',
            100: '#c3f8f6',
            200: '#aff5f3',
            300: '#9bf3f0',
            400: '#7cc2c0',
            500: '#5d9290',
            600: '#3e6160'
        },
        purple:{
            50: '#c2abd7',
            100: '#a382c3',
            200: '#8558af',
            300: '#662e9b',
            400: '#52257c',
            500: '#3d1c5d',
            600: '#29123e'
        },
        blue:{
            50: '#99c9ef',
            100: '#66aee7',
            200: '#3393df',
            300: '#0078d7',
            400: '#0060ac',
            500: '#004881',
            600: '#003056'
        }
    }
})

export default theme