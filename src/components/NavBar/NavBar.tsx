import { useNavigate } from 'react-router-dom'
import { useLogout } from '../../hooks/useLogin'
import ColorModeSwitch from '../ColorModeSwitch'
import { LangSelector } from '../LangSelector'
import { Button, HStack, useColorMode, useColorModeValue } from '@chakra-ui/react'
import { useContext } from 'react'
import { AuthContext } from '../../context/authContext'

const NavBar = () => {
    const navBarColor = useColorModeValue('#0078D7', '#004881')
    const navigate = useNavigate()
    const { setUser, user } = useContext(AuthContext)

    return (
        <HStack padding={3} justifyContent='end' backgroundColor={navBarColor}>
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