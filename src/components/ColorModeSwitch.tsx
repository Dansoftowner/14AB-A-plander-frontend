import { HStack, useColorMode, Button } from '@chakra-ui/react'
import { BsFillSunFill } from "react-icons/bs";
import { BsMoonStarsFill } from "react-icons/bs";



const ColorModeSwitch = () => {
    const { toggleColorMode, colorMode } = useColorMode()
    return (
        <HStack>
            <Button onClick={toggleColorMode} backgroundColor='transparent'>{colorMode === 'light' ? <BsFillSunFill/> : <BsMoonStarsFill/>}</Button>
        </HStack>
    )
}

export default ColorModeSwitch