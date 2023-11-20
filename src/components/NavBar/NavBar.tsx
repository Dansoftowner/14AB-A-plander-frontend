import ColorModeSwitch from '../ColorModeSwitch'
import { LangSelector } from '../LangSelector'
import { HStack } from '@chakra-ui/react'

const NavBar = () => {
    return (
        <HStack padding={3} justifyContent='end' backgroundColor='blue.300'>
            <ColorModeSwitch />
            <LangSelector />
        </HStack >
    )
}

export default NavBar