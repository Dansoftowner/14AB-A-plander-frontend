import ColorModeSwitch from '../ColorModeSwitch'
import { LangSelector } from '../LangSelector'
import { HStack } from '@chakra-ui/react'

const NavBar = () => {
    return (
        <>
            <HStack margin={3} justifyContent='end'>
                <ColorModeSwitch />
                <LangSelector />
            </HStack >
        </>
    )
}

export default NavBar