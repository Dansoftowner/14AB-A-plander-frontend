import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import apiClient from '../../services/apiClient'
import { User } from '../../hooks/useLogin'
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, Checkbox, FormLabel, HStack, Heading, Input, InputGroup, InputRightElement, Text, VStack, useColorModeValue, useDisclosure, useToast } from '@chakra-ui/react'
import useAuth from '../../hooks/useAuth'
import { useTranslation } from 'react-i18next'

import { FaPencilAlt } from "react-icons/fa";
import { IoMdEyeOff, IoMdEye } from 'react-icons/io'
import i18n from '../../i18n'

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

    const isPresident = user?.roles?.includes('president') || false
    const isOwnProfile = user._id == member._id
    const [isEditing, setIsEditing] = useState(false);
    const [isEnabledInput, setIsEnabledInput] = useState({
        email: false,
        username: false,
        password: false,
    });

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
                                    onOpen()
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
            </VStack>

            <AlertDialog
                isOpen={isOpen}
                onClose={onClose}
                leastDestructiveRef={cancelRef}
                isCentered={true}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                            {t('login:editCredentials')}
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            {t('login:reEnterPwd')}
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
                                if (JSON.stringify(oldMember) != JSON.stringify(member) || newPwd != 'KetajtosSzekreny') {
                                    apiClient
                                        .patch('/members/me/credentials', {
                                            username: member.username === oldMember.username ? undefined : member.username,
                                            email: member.email === oldMember.email ? undefined : member.email,
                                            password: newPwd == 'KetajtosSzekreny' ? undefined : newPwd
                                        }, {
                                            headers: {
                                                'x-current-pass': password,
                                                'x-plander-auth':
                                                    localStorage.getItem('token') || sessionStorage.getItem('token'),
                                                'Accept-Language': i18n.language,
                                            }
                                        })
                                        .then((res) => {
                                            if (res.status == 204) {
                                                feedbeckToast({
                                                    title: t('common:success'),
                                                    description: t('login:reLogin'),
                                                    status: 'success',
                                                    duration: 9000,
                                                    position: 'top'
                                                })
                                                reset()
                                                logout()
                                            }
                                        }).catch(err => {
                                            feedbeckToast({
                                                title: t('common:error'),
                                                description: err.response.data.message,
                                                status: 'error',
                                                duration: 9000,
                                                position: 'top'
                                            })
                                            reset()
                                            setNewPwd("KetajtosSzekreny")
                                        })
                                } else {
                                    feedbeckToast({
                                        title: t('common:error'),
                                        description: t('login:noChange'),
                                        status: 'warning',
                                        duration: 9000,
                                        position: 'top'
                                    })
                                    reset()

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