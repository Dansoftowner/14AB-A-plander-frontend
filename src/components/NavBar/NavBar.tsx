import { Link, useNavigate } from 'react-router-dom'
import ColorModeSwitch from '../ColorModeSwitch'
import { LangSelector } from '../LangSelector'
import { Box, Button, Flex, HStack, ScaleFade, Show, Text, useColorModeValue } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import useAuth from '../../hooks/useAuth'
import { User } from '../../hooks/useLogin'
import { MdMenu, MdClose } from "react-icons/md"
import { easeInOut } from 'framer-motion'


const NavBar = () => {
    const navBarColor = useColorModeValue('#0078D7', '#004881')
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false)


    // const { user, setUser } = useAuth()

    const [user, setUser] = useState(JSON.parse(sessionStorage.getItem('user')!) || JSON.parse(localStorage.getItem('user')!))

    useEffect(() => {
        if (localStorage.getItem('user')) setUser(JSON.parse(localStorage.getItem('user')!))
        else setUser(JSON.parse(sessionStorage.getItem('user')!))
    }, [])
    console.log(user)
    return (
        <>
            <HStack padding={3} justifyContent='end' backgroundColor={navBarColor} minW='100%'>
                {user != null &&
                    <Show below='lg'>
                        <Box mr='auto'>
                            <Button backgroundColor='transparent' onClick={() => setIsOpen(!isOpen)}>
                                {isOpen ? <MdClose /> : <MdMenu />}
                            </Button>
                        </Box>
                    </Show>}
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

            <ScaleFade in={isOpen} initialScale={0.9} style={{ zIndex: 10, position: 'absolute' }}>
                <Box width='100vw' backgroundColor='yellow' textAlign='center' display={{ base: isOpen ? 'block' : 'none', lg: 'none' }} position='initial'>
                    <Link to='/' onClick={() => setIsOpen(false)}>
                        <Text fontSize={20} padding={3} height={20} _hover={{ fontSize: 22, transition: ' 0.1s ease-in-out' }}>Főoldal</Text>
                    </Link>
                    <Link to='/members' onClick={() => setIsOpen(false)}>
                        <Text fontSize={20} padding={3} height={20} _hover={{ fontSize: 22, transition: ' 0.1s ease-in-out' }}>Tagok</Text>
                    </Link>
                </Box>
            </ScaleFade>

        </>
    )
}

export default NavBar