import { useNavigate } from 'react-router-dom'
import ColorModeSwitch from '../ColorModeSwitch'
import { LangSelector } from '../LangSelector'
import { Button, HStack, useColorModeValue } from '@chakra-ui/react'
import { useEffect } from 'react'
import useAuth from '../../hooks/useAuth'
import { User } from '../../hooks/useLogin'

const NavBar = () => {
    const navBarColor = useColorModeValue('#0078D7', '#004881')
    const navigate = useNavigate()


    const { user, setUser } = useAuth()
    useEffect(() => {
        if (localStorage.getItem('user')) setUser(JSON.parse(localStorage.getItem('user')!))
        else setUser(JSON.parse(sessionStorage.getItem('user')!))
    }, [])

    return (
        <HStack padding={3} justifyContent='end' backgroundColor={navBarColor}>
            <ColorModeSwitch />
            <LangSelector />
            {(localStorage.getItem('token') || sessionStorage.getItem('token')) &&
                <Button backgroundColor='transparent' onClick={() => {
                    localStorage.removeItem("user");
                    sessionStorage.removeItem("user");
                    sessionStorage.removeItem("token");
                    localStorage.removeItem("token");
                    setUser({} as User)
                    navigate('/login')
                }}>{user?.name}</Button>
            }
        </HStack >
    )
}

export default NavBar