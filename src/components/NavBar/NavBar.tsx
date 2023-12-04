import ColorModeSwitch from '../ColorModeSwitch'
import { LangSelector } from '../LangSelector'
import { HStack, useColorMode } from '@chakra-ui/react'

const NavBar = () => {
    const { colorMode } = useColorMode()
    return (
        <HStack padding={3} justifyContent='end' backgroundColor={colorMode == 'light' ? 'blue.300' : 'blue.50'}>
            <ColorModeSwitch />
            <LangSelector />
        </HStack >
    )
}

export default NavBar