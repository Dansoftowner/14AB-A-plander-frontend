import { useState, useEffect } from 'react'
import { AuthContext } from '../context/authContext'
import NavBar from './NavBar/NavBar'
import { NavLink, Outlet } from 'react-router-dom'
import { Grid, GridItem, Text, Show, useColorModeValue } from '@chakra-ui/react'

const Layout = () => {

    const buttonBg = useColorModeValue('#0078d7', '#fde74c')
    const textColor = useColorModeValue('#000000', '#ffffff')

    const [user, setUser] = useState(JSON.parse(sessionStorage.getItem('user')!) || JSON.parse(localStorage.getItem('user')!))

    useEffect(() => {
        if (localStorage.getItem('user')) setUser(JSON.parse(localStorage.getItem('user')!))
        else setUser(JSON.parse(sessionStorage.getItem('user')!))
    }, [])

    return (
        <>
            <AuthContext.Provider value={{ user, setUser }}>

                <Grid templateAreas={{
                    base: `
            "header" "header"
            "main" "main"`,
                    lg: `
            "header header"
            "nav main" `
                }}
                    templateColumns={{
                        base: `1fr`,
                        lg: `300px`
                    }}>

                    <GridItem area='header'>
                        <NavBar />
                    </GridItem>


                    <GridItem area='nav'>
                        <Show above='lg'>
                            <NavLink to='/' style={({ isActive }) => ({
                                color: isActive ? buttonBg : textColor,
                            })}>
                                <Text fontSize={30} padding={3} height={20} _hover={{ fontSize: 32, transition: ' 0.1s ease-in-out' }}>Főoldal</Text>
                            </NavLink>
                            <NavLink to='/members' style={({ isActive }) => ({
                                color: isActive ? buttonBg : textColor,
                            })}>
                                <Text fontSize={30} padding={3} height={20} _hover={{ fontSize: 32, transition: ' 0.1s ease-in-out' }}>Tagok</Text>
                            </NavLink>
                        </Show>
                    </GridItem>

                    <GridItem area='main'>
                        <Outlet />
                    </GridItem>


                </Grid >
            </AuthContext.Provider >
        </>
    )
}

export default Layout