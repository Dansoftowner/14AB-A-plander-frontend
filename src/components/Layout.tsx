import { useState, useEffect } from 'react'
import { AuthContext } from '../context/authContext'
import NavBar from './NavBar/NavBar'
import { NavLink, Outlet } from 'react-router-dom'
import { Grid, GridItem, Text, Show, useColorModeValue, HStack, Box } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

const Layout = () => {

    const buttonBg = useColorModeValue('#0078d7', '#fde74c')
    const textColor = useColorModeValue('#000000', '#ffffff')
    const { t } = useTranslation('')

    const [user, setUser] = useState(JSON.parse(sessionStorage.getItem('user')!) || JSON.parse(localStorage.getItem('user')!))
    const [token, setToken] = useState(sessionStorage.getItem('token')! || localStorage.getItem('token')!)


    useEffect(() => {
        if (localStorage.getItem('user')) setUser(JSON.parse(localStorage.getItem('user')!))
        else setUser(JSON.parse(sessionStorage.getItem('user')!))
    }, [])

    const activeBg = useColorModeValue('#f5f5f5', 'gray.700')

    return (
        <>
            <AuthContext.Provider value={{ user, setUser, token, setToken }}>

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


                    <GridItem area='nav' mt='7vh' mr={10}>
                        <Show above='lg'>
                            <NavLink to='/' style={({ isActive }) => ({
                                color: isActive ? buttonBg : textColor,
                            })} children={({ isActive }) => {
                                return (
                                    <HStack backgroundColor={isActive ? activeBg : ''} marginY={10} mx={5}>
                                        <Text w='100%' m={0} fontSize={30} px={2} _hover={{ fontSize: 32, transition: ' 0.1s ease-in-out' }}>{t('home')}</Text>
                                        <Box w={1} backgroundColor={isActive ? buttonBg : 'transparent'} h={12} ml='auto' borderRadius={10} />
                                    </HStack>
                                )
                            }} />

                            <NavLink to='/members' style={({ isActive }) => ({
                                color: isActive ? buttonBg : textColor,
                            })} children={({ isActive }) => {
                                return (
                                    <HStack backgroundColor={isActive ? activeBg : ''} marginY={10} mx={5} >
                                        <Text w='100%' m={0} fontSize={30} _hover={{ fontSize: 32, transition: ' 0.1s ease-in-out' }} px={2}>{t('members')}</Text>
                                        <Box w={1} backgroundColor={isActive ? buttonBg : 'transparent'} h={12} ml='auto' borderRadius={10} />
                                    </HStack>
                                )
                            }} />

                            <NavLink to='/assignments' style={({ isActive }) => ({
                                color: isActive ? buttonBg : textColor,
                            })} children={({ isActive }) => {
                                return (
                                    <HStack backgroundColor={isActive ? activeBg : ''} marginY={10} mx={5} >
                                        <Text w='100%' px={2} m={0} fontSize={30} _hover={{ fontSize: 32, transition: ' 0.1s ease-in-out' }}>{t('assignments')}</Text>
                                        <Box w={1} backgroundColor={isActive ? buttonBg : 'transparent'} h={12} ml='auto' borderRadius={10} />
                                    </HStack>
                                )
                            }} />
                            <NavLink to='/reports' style={({ isActive }) => ({
                                color: isActive ? buttonBg : textColor,
                            })} children={({ isActive }) => {
                                return (
                                    <HStack backgroundColor={isActive ? activeBg : ''} marginY={10} mx={5} >
                                        <Text w='100%' px={2} m={0} fontSize={30} _hover={{ fontSize: 32, transition: ' 0.1s ease-in-out' }}>{t('reports')}</Text>
                                        <Box w={1} backgroundColor={isActive ? buttonBg : 'transparent'} h={12} ml='auto' borderRadius={10} />
                                    </HStack>
                                )
                            }} />
                        </Show>
                    </GridItem>

                    <GridItem area='main' mt={16}>
                        <Outlet />
                    </GridItem>


                </Grid >
            </AuthContext.Provider >
        </>
    )
}

export default Layout