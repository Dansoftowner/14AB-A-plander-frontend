import { useState, useEffect } from 'react'
import { AuthContext } from '../context/authContext'
import NavBar from './NavBar/NavBar'
import { Link, NavLink, Navigate, Outlet, useLocation } from 'react-router-dom'
import { Button, Grid, GridItem, Text, Show, useColorModeValue } from '@chakra-ui/react'
import MembersList from './MembersList/MembersList'

const Layout = () => {

    const buttonBg = useColorModeValue('#0078d7', '#fde74c')
    const buttonColor = useColorModeValue('#ffffff', '#004881')
    const buttonHover = useColorModeValue('#0078b0', '#fde7af')
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
            "main" "main"
            "footer" "footer"`,
                    lg: `
            "header header"
            "nav main" 
            "footer footer"`
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


                    <GridItem margin={2} area='footer' backgroundColor='orange'>
                        <p>fúter</p>
                    </GridItem>


                </Grid >
            </AuthContext.Provider >
        </>
    )
}

export default Layout