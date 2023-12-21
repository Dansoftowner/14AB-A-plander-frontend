import { useState, useEffect } from 'react'
import { AuthContext } from '../context/authContext'
import NavBar from './NavBar/NavBar'
import { Link, Navigate, Outlet, useLocation } from 'react-router-dom'
import { Button, Grid, GridItem, HStack, Show, useColorModeValue } from '@chakra-ui/react'
import MembersList from './MembersList/MembersList'

const Layout = () => {

    const buttonBg = useColorModeValue('#0078d7', '#fde74c')
    const buttonColor = useColorModeValue('#ffffff', '#004881')
    const buttonHover = useColorModeValue('#0078b0', '#fde7af')

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


                    <GridItem area='nav' backgroundColor='red'>
                        <Show above='lg'>
                            <Button backgroundColor={buttonBg} color={buttonColor} type='submit' _hover={{ backgroundColor: buttonHover }}>
                                <Link to='/members'>Membörsz</Link>
                            </Button>
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