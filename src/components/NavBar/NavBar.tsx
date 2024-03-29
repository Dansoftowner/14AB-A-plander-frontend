import { NavLink, useNavigate } from 'react-router-dom'
import ColorModeSwitch from '../ColorModeSwitch'
import { LangSelector } from '../LangSelector'
import { Box, Button, Divider, HStack, Menu, MenuButton, MenuItem, MenuList, ScaleFade, Show, Text, useColorModeValue } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { User } from '../../hooks/useLogin'
import { MdMenu, MdClose } from "react-icons/md"
import { FaUserAlt, FaCaretDown, FaPowerOff, FaBell } from "react-icons/fa";
import { useTranslation } from 'react-i18next'

interface Props {
    bgColorDark?: string
    bgColorLight?: string
}


const NavBar = ({ bgColorDark, bgColorLight }: Props) => {
    const navBarColor = useColorModeValue(bgColorLight || '#0078D7', bgColorDark || '#004881')
    const buttonBg = useColorModeValue('#fde74c', '#fde74c')
    const textColor = useColorModeValue('#000000', '#ffffff')
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false)
    const [_openMenu, setOpenMenu] = useState(false)
    const { t } = useTranslation()

    const [user, setUser] = useState(JSON.parse(sessionStorage.getItem('user')!) || JSON.parse(localStorage.getItem('user')!))

    useEffect(() => {
        if (localStorage.getItem('user')) setUser(JSON.parse(localStorage.getItem('user')!))
        else setUser(JSON.parse(sessionStorage.getItem('user')!))
    }, [])
    return (
        <>
            <HStack padding={3} justifyContent='end' position='fixed' zIndex={200} backgroundColor={navBarColor} minW='100%'>
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
                    <Menu>
                        <Text my={0} mx={1}>{user.name}</Text>
                        <MenuButton onClick={() => setOpenMenu(true)} backgroundColor='transparent'>
                            <HStack>
                                <FaUserAlt />
                                <FaCaretDown />
                            </HStack>
                        </MenuButton>
                        <MenuList zIndex={330}>
                            <MenuItem onClick={() => {
                                navigate('member/' + user._id!, {
                                    state: { id: user._id }
                                })
                            }}>
                                <HStack>
                                    <FaUserAlt />
                                    <Text mt={4}>{t('myProfile')}</Text>
                                </HStack>
                            </MenuItem>
                            <MenuItem isDisabled>
                                <HStack>
                                    <FaBell />
                                    <Text mt={4}>{t('notifications')}</Text>
                                </HStack>
                            </MenuItem>
                            <Divider />
                            <MenuItem onClick={() => {
                                localStorage.removeItem("user");
                                sessionStorage.removeItem("user");
                                sessionStorage.removeItem("token");
                                localStorage.removeItem("token");
                                setUser({} as User)
                                navigate('/login')
                            }}>
                                <HStack>
                                    <FaPowerOff />
                                    <Text mt={3}>{t('logout')}</Text>
                                </HStack>
                            </MenuItem>
                        </MenuList>
                    </Menu>

                }
            </HStack >

            <ScaleFade in={isOpen} unmountOnExit initialScale={0.9} style={{ zIndex: 10, position: 'absolute' }}>
                <Box mt={49} width='100vw' backgroundColor={navBarColor} textAlign='center' display={{ base: isOpen ? 'block' : 'none', lg: 'none' }} position='initial'>
                    <NavLink to='/' onClick={() => setIsOpen(false)} style={({ isActive }) => ({
                        color: isActive ? buttonBg : textColor,
                    })}>
                        <Text fontSize={20} padding={3} height={20} _hover={{ fontSize: 22, transition: ' 0.2s ease-in-out' }}>{t('home')}</Text>
                    </NavLink>
                    <NavLink to='/chats' onClick={() => setIsOpen(false)} style={({ isActive }) => ({
                        color: isActive ? buttonBg : textColor,
                    })}>
                        <Text fontSize={20} padding={3} height={20} _hover={{ fontSize: 22, transition: ' 0.2s ease-in-out' }}>{t('messages')}</Text>
                    </NavLink>
                    <NavLink to='/members' onClick={() => setIsOpen(false)} style={({ isActive }) => ({
                        color: isActive ? buttonBg : textColor,
                    })}>
                        <Text fontSize={20} padding={3} height={20} _hover={{ fontSize: 22, transition: ' 0.2s ease-in-out' }}>{t('members')}</Text>
                    </NavLink>
                    <NavLink to='/assignments' onClick={() => setIsOpen(false)} style={({ isActive }) => ({
                        color: isActive ? buttonBg : textColor,
                    })}>
                        <Text fontSize={20} padding={3} height={20} _hover={{ fontSize: 22, transition: ' 0.2s ease-in-out' }}>{t('assignments')}</Text>
                    </NavLink>
                    <NavLink to='/reports' onClick={() => setIsOpen(false)} style={({ isActive }) => ({
                        color: isActive ? buttonBg : textColor,
                    })}>
                        <Text fontSize={20} padding={3} height={20} _hover={{ fontSize: 22, transition: ' 0.2s ease-in-out' }}>{t('reports')}</Text>
                    </NavLink>
                </Box>
            </ScaleFade>

        </>
    )
}

export default NavBar