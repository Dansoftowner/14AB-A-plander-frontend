import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import apiClient from '../../services/apiClient'
import {
    AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Box,
    Button, Center, Checkbox, FormLabel, HStack, Heading, Icon, Input, InputGroup, InputRightElement, Menu, ScaleFade, Spinner, Stack, Text, VStack, useColorModeValue, useDisclosure, useToast
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

import { FaPencilAlt } from "react-icons/fa";
import { IoMdEyeOff, IoMdEye } from 'react-icons/io'
import { GrUserPolice } from "react-icons/gr";
import { User } from '../../hooks/useLogin'
import { useAuth, useCredentials, usePatchMember, useTransfer } from '../../hooks/hooks'
import { guardNumberHandler, telHandler } from '../RegisterForm/specInputHandler'
import PhoneDropdownList from '../PhoneDropdownList/PhoneDropdownList'
import { PhoneFormat, phoneMap } from '../PhoneDropdownList/phones'
import { memberSchema } from '../RegisterForm/inputSchema'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { validate } from './utils'

interface Alert {
    header: string,
    body: string
}

const MemberDetail = () => {
    const buttonBg = useColorModeValue('#0078d7', '#fde74c')
    const buttonColor = useColorModeValue('#ffffff', '#004881')
    const buttonHover = useColorModeValue('#0078b0', '#fde7af')

    const bodyColor = useColorModeValue('#ffffff', '#1A202C')
    const iconColor = useColorModeValue('#000', '#fff')
    const borderColor = useColorModeValue('#000', '#fff')

    const location = useLocation()
    const navigate = useNavigate()
    const { user, setUser } = useAuth()
    const { t } = useTranslation('register')
    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = useRef<HTMLButtonElement>(null)
    const feedbeckToast = useToast()

    const [member, setMember] = useState({} as User)
    const [oldMember, setOldMember] = useState({} as User)
    const [newPwd, setNewPwd] = useState("00000000AA")
    const [newPwdRepeat, setNewPwdRepeat] = useState('00000000AA')

    const [password, setPassword] = useState('')
    const [show, setShow] = useState(false)
    const isVisible = () => (show ? <IoMdEyeOff /> : <IoMdEye />)

    const isPresident = user?.roles?.includes('president') || false
    const isOwnProfile = user._id == member._id
    const [isEnabledInput, setIsEnabledInput] = useState({
        email: false,
        username: false,
        password: false,
    });

    const [phone, setPhone] = useState<PhoneFormat>({
        src: '/assets/flags/hu.svg',
        prefix: '+36',
        length: 7,
    })
    const [memberPrefix, setMemberPrefix] = useState('')

    const inputSchema = useMemo(() => memberSchema(t), [t])
    type RegForm = z.infer<typeof inputSchema>
    const { register, handleSubmit, formState: { errors } } = useForm<RegForm>({ resolver: zodResolver(inputSchema) })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!(localStorage.getItem('token') || sessionStorage.getItem('token'))) navigate('/login')
        apiClient.get('/members/' + location.state?.id, {
            headers: {
                'x-plander-auth':
                    localStorage.getItem('token') || sessionStorage.getItem('token')
            },
            params: {
                'projection': 'full'
            }
        }).then(res => {
            if (res.status === 200) {
                setMember(res.data)
                setOldMember(res.data)
                setLoading(false)
                if (res.data) {
                    let phone = res.data.phoneNumber
                    let prefix = phone.split(' ')[0]
                    phone = phone.substring(prefix.length + 1)

                    setPhone(phoneMap.filter(item => item.prefix === prefix)[0])
                    member.phoneNumber = phone
                    setMemberPrefix(prefix)
                    setMember({ ...res.data, phoneNumber: phone })
                    setOldMember({ ...res.data, phoneNumber: phone })
                }
            }
        }).catch(() => {
            navigate('/members')
        })
    }, [location.state?.id])



    const [dialog, setDialog] = useState({} as Alert)

    const reset = () => {
        onClose()
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
        if (JSON.stringify(oldMember) != JSON.stringify(member) || newPwd != '00000000AA') {
            useCredentials(member, oldMember, password, newPwd)
                .then((res) => {
                    if (res.status == 204) {
                        patch(false)
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
                        setNewPwd("00000000AA")
                        setNewPwdRepeat('00000000AA')
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
                    setMember(res.data)
                    feedbeckToast({
                        title: t('common:success'),
                        status: 'success',
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
    const patch = (toast: boolean) => {
        if (toast) {
            usePatchMember(oldMember, member, phone).then((res) => {
                if (res.status === 200) {
                    feedbeckToast({
                        title: t('common:success'),
                        status: 'success',
                        duration: 9000,
                        position: 'top'
                    })
                }
                else {
                    feedbeckToast({
                        title: t('common:error'),
                        description: res.response.data.message,
                        status: 'error',
                        duration: 9000,
                        position: 'top'
                    })
                }
            })
        } else usePatchMember(oldMember, member, phone)
    }



    return (
        <ScaleFade in>
            <VStack spacing={6} mb={7} mt={20} mx='auto' borderRadius={20} width='fit-content' padding={4}
                boxShadow='dark-lg'>
                <Box backgroundColor={borderColor} border='1px solid' borderColor={borderColor} position='absolute' top={20} padding={74} borderRadius='50%' />
                <Box boxShadow='dark-lg' backgroundColor={bodyColor} alignItems='center' justifyContent='center' border='1px solid white' position='absolute' top={20} mt={1} width='fit-content' h='fit-content' padding={25} borderRadius='50%' >
                    <Icon as={GrUserPolice} color={iconColor} fontSize={90} />
                </Box>
                <Heading textAlign='center' mt={20} maxW='95vw'>{member.name || 'Ismeretlen'}{t('userData')}</Heading>
                {member.roles?.includes('president') && <Heading maxW='95vw' as='h3' fontSize={30}>{t('common:president')}</Heading>}
                <form onSubmit={handleSubmit(e => {
                    console.log(e)
                })}>
                    {loading && <Center zIndex={300} position='absolute' left='50%'><Spinner maxH='80vh' maxW='80vw' height={200} width={200} /></Center>}
                    <VStack maxW='90vw'>
                        <HStack maxW='95vw'>
                            <FormLabel width={205}>{t('email')}: </FormLabel>
                            <Input w={isOwnProfile ? 310 : 360} boxShadow='md' borderColor='#767676' disabled={!isEnabledInput.email} value={member.email} {...register('email', { onChange: (e) => { setMember({ ...member, email: e.target.value }) } })} />
                            {isOwnProfile && <Button _hover={{ backgroundColor: buttonHover }} w={13} backgroundColor={buttonBg} color={buttonColor} onClick={() => setIsEnabledInput({ ...isEnabledInput, email: !isEnabledInput.email })} >
                                <FaPencilAlt />
                            </Button>}
                        </HStack>
                        {errors?.email && <Text color='red.500'>{t('register:zodEmail')}</Text>}
                        {
                            isOwnProfile &&
                            <VStack maxW='95vw'>
                                <HStack maxW='95vw'>
                                    <FormLabel width={205}>{t('username')}: </FormLabel>
                                    <Input w={310} boxShadow='md' borderColor='#767676' disabled={!isEnabledInput.username} value={member.username} onChange={(e) => { setMember({ ...member, username: e.target.value }) }} />
                                    <Button w={13} _hover={{ backgroundColor: buttonHover }} backgroundColor={buttonBg} color={buttonColor} onClick={() => setIsEnabledInput({ ...isEnabledInput, username: !isEnabledInput.username })}>
                                        <FaPencilAlt />
                                    </Button>
                                </HStack>
                                <HStack maxW='95vw' mb={isEnabledInput.password ? 0 : 4}>
                                    <FormLabel w={205}>{t('password')}: </FormLabel>
                                    <Input w={310} boxShadow='md' borderColor='#767676' type='password' disabled={!isEnabledInput.password} value={newPwd} {...register('password', { onChange: (e) => { setNewPwd(e.target.value) } })} />
                                    <Button _hover={{ backgroundColor: buttonHover }} w={13} backgroundColor={buttonBg} color={buttonColor} onClick={() => {
                                        if (!isEnabledInput.password) {
                                            setNewPwd('')
                                            setNewPwdRepeat('')
                                        }
                                        else {
                                            setNewPwd('00000000AA')
                                            setNewPwdRepeat('00000000AA')
                                        }
                                        setIsEnabledInput({ ...isEnabledInput, password: !isEnabledInput.password })
                                    }}>
                                        <FaPencilAlt />
                                    </Button>
                                </HStack>
                                {isEnabledInput.password &&
                                    <HStack maxW='95vw' mb={4}>
                                        <FormLabel w={205}>{t('register:repeatPwd')}: </FormLabel>
                                        <Input w={310} mr={50} boxShadow='md' borderColor='#767676' type='password' value={newPwdRepeat} {...register('repeatedPassword', { onChange: (e) => { setNewPwdRepeat(e.target.value) } })} />
                                    </HStack>
                                }
                                {(isEnabledInput.password && errors?.password) && <Text color='red.500'>{t('register:zodPassword')}</Text>}
                                {(isEnabledInput.password && errors?.repeatedPassword) && <Text color='red.500'>{t('register:zodRepeatedPwd')}</Text>}
                            </VStack>
                        }
                        <Stack maxW='95vw' direction={['column', 'row']}>
                            <FormLabel w={[210, 210, 200, 200, 210]}>{t('phone')}:</FormLabel>
                            <HStack>
                                <InputGroup as={Menu} alignItems='start'>
                                    <Box backgroundColor='transparent' border='none' w={[260, 150, 150, 150, 150]} >
                                        <PhoneDropdownList
                                            isDisabled={!isOwnProfile}
                                            selectedPhone={phone}
                                            items={phoneMap}
                                            selectionChange={(p) => setPhone(p)}
                                        />
                                    </Box>
                                    <Input w={[270, 200, 208, 208, 200]} maxLength={phone?.prefix == "+36" ? 11 : 20} boxShadow='md' borderColor='#767676' disabled={!isOwnProfile} value={member.phoneNumber}
                                        onChange={(e) => setMember({ ...member, phoneNumber: e.target.value })} onChangeCapture={(e) => {
                                            if (phone.prefix == "+36") telHandler(e)
                                        }} />
                                </InputGroup>
                            </HStack>
                        </Stack>
                        {(isPresident || isOwnProfile) &&
                            <HStack maxW='95vw'>
                                <FormLabel width={350}>{t('address')}: </FormLabel>
                                <Input boxShadow='md' borderColor='#767676' disabled={!isOwnProfile} value={member.address} onChange={(e) => setMember({ ...member, address: e.target.value })} />
                            </HStack>
                        }
                        <HStack>
                        </HStack>
                    </VStack>
                    <VStack maxW='90vw'>
                        {(isPresident || isOwnProfile) &&
                            <HStack maxW='95vw'>
                                <FormLabel width={350}>{t('idNumber')}: </FormLabel>
                                <Input boxShadow='md' borderColor='#767676' disabled={!isOwnProfile} value={member.idNumber} onChange={(e) => setMember({ ...member, idNumber: e.target.value })} />
                            </HStack>
                        }
                        <HStack maxW='95vw'>
                            <FormLabel width={350}>{t('guardNumber')}: </FormLabel>
                            <Input boxShadow='md' borderColor='#767676' disabled={!isOwnProfile} defaultValue={member.guardNumber} maxLength={13} onChangeCapture={(e) => guardNumberHandler(e)} {...register('guardNumber', { onChange: (e) => { setMember({ ...member, guardNumber: e.target.value }) } })} />
                        </HStack>
                        {errors?.guardNumber && <Text color='red.500'>{t('register:zodGuardNumber')}</Text>}
                        <Checkbox my={5} isChecked={oldMember.isRegistered} disabled>{t('finishedRegistration')}</Checkbox>
                        {isOwnProfile &&
                            <HStack maxW='95vw' my={5}>
                                {(JSON.stringify(oldMember) != JSON.stringify(member) || newPwd != '00000000AA' || phone.prefix != memberPrefix) &&
                                    <Button boxShadow='lg' type='submit' _hover={{ backgroundColor: buttonHover }} backgroundColor={buttonBg} color={buttonColor}
                                        onClick={() => {
                                            if (validate(member.guardNumber, member.email, newPwd)) {
                                                if (oldMember.email != member.email || oldMember.username != member.username || newPwd != '00000000AA') {
                                                    confirmOpen(t('login:reEnterPwd'), t('login:editCredentials'))
                                                } else {
                                                    patch(true)
                                                    setOldMember(member)
                                                }
                                            }
                                        }}
                                    >
                                        <Text mb={0} mx={3}>{t('common:save')}</Text>
                                    </Button>
                                }
                            </HStack>
                        }
                        {
                            (isPresident && !member.roles?.includes('president')) &&
                            <Stack my={3}>
                                <Button boxShadow='lg' _hover={{ backgroundColor: buttonHover }} backgroundColor={buttonBg} color={buttonColor} onClick={() => confirmOpen(t('member:promoteBody'), t('member:promoteHeader'),)}>{t('member:toPresident')}</Button>
                            </Stack>
                        }
                    </VStack>
                </form >
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
                            <AlertDialogBody>
                                {dialog.body}
                                <InputGroup my={2}>
                                    <Input type={show ? 'text' : 'password'} onChangeCapture={(e) => setPassword((e.target as HTMLInputElement).value)} />
                                    <InputRightElement width="4.5rem">
                                        <Button backgroundColor='transparent' h='1.75rem' size='sm' onClick={() => setShow(!show)}>
                                            {isVisible()}
                                        </Button>
                                    </InputRightElement>
                                </InputGroup>
                                <Link to='/forgotten-password'><Text fontStyle='italic' h={3} _hover={{ color: buttonBg, fontSize: 17, transition: '0.3s ease-in-out' }}>{t('login:forgotMyPassword')}</Text></Link>
                            </AlertDialogBody>
                            <AlertDialogFooter>
                                <Button onClick={() => {
                                    onClose()
                                    setMember(oldMember)
                                    setIsEnabledInput({ email: false, username: false, password: false })
                                    setNewPwd("00000000AA")
                                }}>
                                    {t('common:cancel')}
                                </Button>
                                <Button colorScheme='green' onClick={() => {
                                    if (location.state.id == user._id) {
                                        save()
                                        setNewPwd("00000000AA")
                                        setIsEnabledInput({ email: false, username: false, password: false })
                                        setMember(oldMember)
                                    }
                                    else {
                                        transferRoles()
                                    }
                                }} ml={3}>
                                    {t('common:save')}
                                </Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialogOverlay>
                </AlertDialog >
                <Button boxShadow='lg' mb={4} _hover={{ backgroundColor: buttonHover }} backgroundColor={buttonBg} color={buttonColor} onClick={() => history.back()}><Text mb={0}>{t('common:back')}</Text></Button>
            </VStack >
        </ScaleFade>

    )
}

export default MemberDetail