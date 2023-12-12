import ColorModeSwitch from '../ColorModeSwitch'
import { LangSelector } from '../LangSelector'
import { HStack, useColorModeValue } from '@chakra-ui/react'

const NavBar = () => {
    const navBarColor = useColorModeValue('#0078D7', '#004881')
    return (
        <HStack padding={3} justifyContent='end' backgroundColor={navBarColor}>
            <ColorModeSwitch />
            <LangSelector />
        </HStack >
    )
}

export default NavBar