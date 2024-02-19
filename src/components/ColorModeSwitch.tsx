import { HStack, useColorMode, Button } from '@chakra-ui/react'
import { BsFillSunFill } from "react-icons/bs";
import { BsMoonStarsFill } from "react-icons/bs";
import useAuth from '../hooks/useAuth';
import { useEffect } from 'react';



const ColorModeSwitch = () => {
    const { colorMode, setColorMode } = useColorMode()
    const { preferences, setPreferences } = useAuth()

    const setColor = () => {
        setColorMode(colorMode === 'light' ? 'dark' : 'light')
        setPreferences({ ...preferences, colorMode: colorMode === 'light' ? 'dark' : 'light' })
    }

    useEffect(() => {
        setColorMode(preferences?.colorMode || colorMode)
    }, [preferences])

    return (
        <HStack>
            <Button onClick={setColor} backgroundColor='transparent'>{colorMode === 'light' ? <BsFillSunFill /> : <BsMoonStarsFill />}</Button>
        </HStack>
    )
}

export default ColorModeSwitch