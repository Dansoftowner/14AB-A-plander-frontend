import { useNavigate } from 'react-router-dom'
import { useLogout } from '../../hooks/useLogin'
import ColorModeSwitch from '../ColorModeSwitch'
import { LangSelector } from '../LangSelector'
import { Button, HStack, useColorMode } from '@chakra-ui/react'
import { useContext } from 'react'
import { AuthContext } from '../../context/authContext'

const NavBar = () => {
    const { colorMode } = useColorMode()
    const navigate = useNavigate()
    const { setUser, user } = useContext(AuthContext)

    return (
        <HStack padding={3} justifyContent='end' backgroundColor={colorMode == 'light' ? 'blue.300' : 'blue.50'}>
            <ColorModeSwitch />
            <LangSelector />
            <Button backgroundColor='transparent' onClick={() => {
                useLogout().then(() => {
                    // setAuthToken('')
                    setUser({ type: 'REMOVE_TOKEN' })
                    localStorage.removeItem("token");
                    navigate('/login')
                })
            }}>{user?.name || 'Nincs bejelentkezve'}</Button>
        </HStack >
    )
}

export default NavBar