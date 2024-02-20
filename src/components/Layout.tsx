import { useState, useEffect } from 'react'
import { AuthContext } from '../context/authContext'
import NavBar from './NavBar/NavBar'
import { NavLink, Outlet } from 'react-router-dom'
import { Grid, GridItem, Text, Show, useColorModeValue, HStack } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { usePreferences } from '../hooks/hooks'
import '../App.css'

const Layout = () => {

    const buttonBg = useColorModeValue('#0078d7', '#fde74c')
    const textColor = useColorModeValue('#000000', '#ffffff')
    const { t } = useTranslation('')

    const [user, setUser] = useState(JSON.parse(sessionStorage.getItem('user')!) || JSON.parse(localStorage.getItem('user')!))
    const [token, setToken] = useState(sessionStorage.getItem('token')! || localStorage.getItem('token')!)
    const [preferences, setPreferences] = useState()

    useEffect(() => {
        if (localStorage.getItem('user')) setUser(JSON.parse(localStorage.getItem('user')!))
        else setUser(JSON.parse(sessionStorage.getItem('user')!))
        usePreferences().then(res => setPreferences(res))
    }, [])

    const activeBg = useColorModeValue('#f0f0f0', 'gray.700')
    const bodyBg = useColorModeValue('#ffffff', 'gray.800')

    return (
        <>
            <AuthContext.Provider value={{ user, setUser, token, setToken, preferences, setPreferences }}>

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


                    <GridItem area='nav' mt='6vh' minH='94vh' mr={3} backgroundColor={activeBg}>
                        <Show above='lg'>
                            <NavLink to='/' style={({ isActive }) => ({
                                color: isActive ? buttonBg : textColor,
                            })} children={({ isActive }) => {
                                return (
                                    <HStack borderStartRadius={25} backgroundColor={isActive ? bodyBg : activeBg} py={2} marginY={10} ml={5}>
                                        <Text w='100%' ml={3} my={0} fontSize={30} px={2} >{t('home')}</Text>
                                    </HStack>
                                )
                            }} />
                            <NavLink to='/chats' style={({ isActive }) => ({
                                color: isActive ? buttonBg : textColor,
                            })} children={({ isActive }) => {
                                return (
                                    <HStack borderStartRadius={25} backgroundColor={isActive ? bodyBg : activeBg} py={2} marginY={10} ml={5}>
                                        <Text w='100%' ml={3} my={0} fontSize={30} px={2} >{t('messages')}</Text>
                                    </HStack>
                                )
                            }} />

                            <NavLink to='/members' style={({ isActive }) => ({
                                color: isActive ? buttonBg : textColor,
                            })} children={({ isActive }) => {
                                return (
                                    <HStack borderStartRadius={25} backgroundColor={isActive ? bodyBg : activeBg} py={2} marginY={10} ml={5}>
                                        <Text w='100%' ml={3} my={0} fontSize={30} px={2}>{t('members')}</Text>
                                    </HStack>
                                )
                            }} />

                            <NavLink to='/assignments' style={({ isActive }) => ({
                                color: isActive ? buttonBg : textColor,
                            })} children={({ isActive }) => {
                                return (
                                    <HStack borderStartRadius={25} backgroundColor={isActive ? bodyBg : activeBg} py={2} marginY={10} ml={5} >
                                        <Text w='100%' px={2} ml={3} my={0} fontSize={30} >{t('assignments')}</Text>
                                    </HStack>
                                )
                            }} />
                            <NavLink to='/reports' style={({ isActive }) => ({
                                color: isActive ? buttonBg : textColor,
                            })} children={({ isActive }) => {
                                return (
                                    <HStack borderStartRadius={25} backgroundColor={isActive ? bodyBg : activeBg} py={2} marginY={10} ml={5} >
                                        <Text w='100%' px={2} ml={3} my={0} fontSize={30} >{t('reports')}</Text>
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