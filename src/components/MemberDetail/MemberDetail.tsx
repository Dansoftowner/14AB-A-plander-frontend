import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import apiClient from '../../services/apiClient'
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, Checkbox, FormLabel, HStack, Heading, Input, InputGroup, InputRightElement, Stack, Text, VStack, useColorModeValue, useDisclosure, useToast } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

import { FaPencilAlt } from "react-icons/fa";
import { IoMdEyeOff, IoMdEye } from 'react-icons/io'
import { User } from '../../hooks/useLogin'
import { useAuth, useCredentials, useTransfer } from '../../hooks/hooks'

interface Alert {
    header: string,
    body: string
}

const MemberDetail = () => {
    const buttonBg = useColorModeValue('#0078d7', '#fde74c')
    const buttonColor = useColorModeValue('#ffffff', '#004881')
    const buttonHover = useColorModeValue('#0078b0', '#fde7af')

    const location = useLocation()
    const navigate = useNavigate()
    const { user, setUser } = useAuth()
    const { t } = useTranslation('register')
    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = useRef<HTMLButtonElement>(null)
    const feedbeckToast = useToast()

    const [member, setMember] = useState({} as User)
    const [oldMember, setOldMember] = useState({} as User)
    const [newPwd, setNewPwd] = useState("KetajtosSzekreny")

    const [password, setPassword] = useState('')
    const [show, setShow] = useState(false)
    const isVisible = () => (show ? <IoMdEyeOff /> : <IoMdEye />)

    const isPresident = user?.roles?.includes('president') || false
    const isOwnProfile = user._id == member._id
    const [isEditing, setIsEditing] = useState(false);
    const [isEnabledInput, setIsEnabledInput] = useState({
        email: false,
        username: false,
        password: false,
    });

    useEffect(() => {
        apiClient.get('/members/' + location.state.id, {
            headers: {
                'x-plander-auth':
                    localStorage.getItem('token') || sessionStorage.getItem('token')
            },
            params: {
                'projection': 'full'
            }
        }).then(res => {
            if (res.status === 200)
                setMember(res.data)
            setOldMember(res.data)
        })
    }, [location.state.id])


    const [dialog, setDialog] = useState({} as Alert)

    const reset = () => {
        onClose()
        setIsEditing(false)
        setIsEnabledInput({ email: false, username: false, password: false })
    }

    const logout = () => {
        localStorage.removeItem("user");
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("token");
        localStorage.removeItem("token");
        setUser({} as User)
        navigate('/login')
    }

    const confirmOpen = (body: string, header: string) => {
        onOpen()
        setDialog({
            header: header,
            body: body,
        })
    }

    const save = () => {
        if (JSON.stringify(oldMember) != JSON.stringify(member) || newPwd != 'KetajtosSzekreny') {
            useCredentials(member, oldMember, password, newPwd)
                .then((res) => {
                    if (res.status == 204) {
                        feedbeckToast({
                            title: t('common:success'),
                            description: t('member:reLogin'),
                            status: 'success',
                            duration: 9000,
                            position: 'top'
                        })
                        logout()
                    } else {
                        feedbeckToast({
                            title: t('common:error'),
                            description: res.response.data.message,
                            status: 'error',
                            duration: 9000,
                            position: 'top'
                        })
                        setNewPwd("KetajtosSzekreny")
                    }
                    reset()
                })
        } else {
            feedbeckToast({
                title: t('common:error'),
                description: t('member:noChange'),
                status: 'warning',
                duration: 9000,
                position: 'top'
            })
            reset()

        }
    }
    const transferRoles = () => {
        useTransfer(member._id, password)
            .then(res => {
                if (res.status === 200) {
                    feedbeckToast({
                        title: 'a',
                        description: 'jo',
                        status: 'error',
                        duration: 9000,
                        position: 'top',
                    })
                } else {
                    feedbeckToast({
                        title: t('common:error'),
                        description: res.response.data.message,
                        status: 'error',
                        duration: 9000,
                        position: 'top',
                    })
                }
                onClose()

            })
    }

    return (
        <VStack spacing={6} mt={10}>
            <Heading maxW='95vw'>{member.name || 'Ismeretlen'}{t('userData')}</Heading>
            {member.roles?.includes('president') && <Heading maxW='95vw' as='h3' fontSize={30}>{t('common:president')}</Heading>}
            <VStack maxW='90vw'>
                <HStack maxW='95vw'>
                    <FormLabel width={isEditing ? 295 : 350}>{t('email')}: </FormLabel>
                    <Input borderColor='#767676' disabled={!isEnabledInput.email} value={member.email} onChange={(e) => { setMember({ ...member, email: e.target.value }) }} />
                    {isEditing &&
                        <Button _hover={{ backgroundColor: buttonHover }} backgroundColor={buttonBg} color={buttonColor} onClick={() => setIsEnabledInput({ ...isEnabledInput, email: !isEnabledInput.email })} >
                            <FaPencilAlt />
                        </Button>}
                </HStack>
                {
                    isOwnProfile &&
                    <VStack>
                        <HStack maxW='95vw'>
                            <FormLabel width={isEditing ? 295 : 350}>{t('username')}: </FormLabel>
                            <Input borderColor='#767676' disabled={!isEnabledInput.username} value={member.username} onChange={(e) => { setMember({ ...member, username: e.target.value }) }} />
                            {isEditing &&
                                <Button _hover={{ backgroundColor: buttonHover }} backgroundColor={buttonBg} color={buttonColor} onClick={() => setIsEnabledInput({ ...isEnabledInput, username: !isEnabledInput.username })}>
                                    <FaPencilAlt />
                                </Button>}
                        </HStack>
                        <HStack maxW='95vw'>
                            <FormLabel width={isEditing ? 295 : 350}>{t('password')}: </FormLabel>
                            <Input borderColor='#767676' type='password' disabled={!isEnabledInput.password} value={newPwd} onChange={(e) => { setNewPwd(e.target.value) }} />
                            {isEditing &&
                                <Button _hover={{ backgroundColor: buttonHover }} backgroundColor={buttonBg} color={buttonColor} onClick={() => {
                                    if (!isEnabledInput.password) setNewPwd("")
                                    setIsEnabledInput({ ...isEnabledInput, password: !isEnabledInput.password })
                                }}>
                                    <FaPencilAlt />
                                </Button>}
                        </HStack>
                        <HStack maxW='95vw' my={10}>
                            <Button _hover={{ backgroundColor: buttonHover }} backgroundColor={buttonBg} color={buttonColor} onClick={() => {
                                setIsEditing(!isEditing)
                                setNewPwd("KetajtosSzekreny")
                                setIsEnabledInput({ email: false, username: false, password: false })
                                setMember(oldMember)
                            }}>
                                {!isEditing && <FaPencilAlt />}
                                <Text mb={0} mx={3}>{isEditing ? t('common:cancel') : t('common:edit')}</Text>
                            </Button>
                            {
                                (isEditing && JSON.stringify(oldMember) != JSON.stringify(member) || newPwd != 'KetajtosSzekreny') &&
                                <Button _hover={{ backgroundColor: buttonHover }} backgroundColor={buttonBg} color={buttonColor} onClick={() => {
                                    setIsEditing(!isEditing)
                                    confirmOpen(t('login:reEnterPwd'), t('login:editCredentials'))
                                }}>
                                    <Text mb={0} mx={3}>{t('common:save')}</Text>
                                </Button>
                            }
                        </HStack>
                    </VStack>
                }

                <HStack maxW='95vw'>
                    <FormLabel width={350}>{t('phone')}: </FormLabel>
                    <Input borderColor='#767676' disabled value={member.phoneNumber} />
                </HStack>
                {(isPresident || isOwnProfile) &&
                    <HStack maxW='95vw'>
                        <FormLabel width={350}>{t('address')}: </FormLabel>
                        <Input borderColor='#767676' disabled value={oldMember.address} />
                    </HStack>
                }
                <HStack>

                </HStack>
            </VStack>
            <VStack mt={10} maxW='90vw'>
                <Checkbox my={10} isChecked={oldMember.isRegistered} disabled>{t('finishedRegistration')}</Checkbox>
                {(isPresident || isOwnProfile) &&
                    <>
                        <HStack maxW='95vw'>
                            <FormLabel width={350}>{t('idNumber')}: </FormLabel>
                            <Input borderColor='#767676' disabled value={oldMember.idNumber} />
                        </HStack>
                        <HStack maxW='95vw'>
                            <FormLabel width={350}>{t('guardNumber')}: </FormLabel>
                            <Input borderColor='#767676' disabled value={oldMember.guardNumber} />
                        </HStack>
                    </>
                }

                {
                    (isPresident && !member.roles?.includes('president')) &&
                    <Stack my={10}>
                        <Button _hover={{ backgroundColor: buttonHover }} backgroundColor={buttonBg} color={buttonColor} onClick={() => confirmOpen(t('member:promoteBody'), t('member:promoteHeader'),)}>{t('member:toPresident')}</Button>
                    </Stack>
                }
            </VStack>

            {/* pwd confirmation panel */}
            <AlertDialog
                isOpen={isOpen}
                onClose={onClose}
                leastDestructiveRef={cancelRef}
                isCentered={true}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>

                        <AlertDialogHeader fontSize='lg' fontWeight='bold' children={dialog.header} />
                        {/* {t('login:editCredentials')} */}

                        <AlertDialogBody>
                            {dialog.body}
                            {/* {t('login:reEnterPwd')} */}
                            <InputGroup my={2}>
                                <Input type={show ? 'text' : 'password'} onChangeCapture={(e) => setPassword((e.target as HTMLInputElement).value)} />
                                <InputRightElement width="4.5rem">
                                    <Button backgroundColor='transparent' h='1.75rem' size='sm' onClick={() => setShow(!show)}>
                                        {isVisible()}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button onClick={() => {
                                onClose()
                            }}>
                                {t('common:cancel')}
                            </Button>
                            <Button colorScheme='green' onClick={() => {
                                if (location.state.id == user._id) {
                                    save()
                                    setIsEditing(!isEditing)
                                    setNewPwd("KetajtosSzekreny")
                                    setIsEnabledInput({ email: false, username: false, password: false })
                                    setMember(oldMember)
                                }
                                else {
                                    console.log(password)
                                    transferRoles()
                                }
                            }} ml={3}>
                                {t('common:save')}
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>

            <Button mb={8} _hover={{ backgroundColor: buttonHover }} backgroundColor={buttonBg} color={buttonColor} onClick={() => navigate('/members')}><Text mb={0}>{t('common:back')}</Text></Button>

        </VStack>

    )
}

export default MemberDetail