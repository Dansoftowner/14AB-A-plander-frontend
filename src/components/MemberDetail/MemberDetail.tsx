import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import apiClient from '../../services/apiClient'
import { User } from '../../hooks/useLogin'
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, Checkbox, FormLabel, HStack, Heading, Input, InputGroup, InputRightElement, Text, VStack, useColorModeValue, useDisclosure } from '@chakra-ui/react'
import useAuth from '../../hooks/useAuth'
import { useTranslation } from 'react-i18next'

import { FaPencilAlt } from "react-icons/fa";
import { IoMdEyeOff, IoMdEye } from 'react-icons/io'

const MemberDetail = () => {
    const buttonBg = useColorModeValue('#0078d7', '#fde74c')
    const buttonColor = useColorModeValue('#ffffff', '#004881')
    const buttonHover = useColorModeValue('#0078b0', '#fde7af')

    const location = useLocation()
    const navigate = useNavigate()
    const { user } = useAuth()
    const { t } = useTranslation('register')
    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = useRef<HTMLButtonElement>(null)

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

    return (
        <VStack spacing={6} mt={10}>
            <Heading>{member.name || 'Ismeretlen'}{t('userData')}</Heading>
            {member.roles?.includes('president') && <Heading as='h3' fontSize={30}>{t('common:president')}</Heading>}
            <VStack maxW='90vw'>
                <Text fontSize={20}><b>{t('contacts')}:</b></Text>
                <HStack >
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
                        <HStack>
                            <FormLabel width={isEditing ? 295 : 350}>Felhasználónév: </FormLabel>
                            <Input borderColor='#767676' disabled={!isEnabledInput.username} value={member.username} onChange={(e) => { setMember({ ...member, username: e.target.value }) }} />
                            {isEditing &&
                                <Button _hover={{ backgroundColor: buttonHover }} backgroundColor={buttonBg} color={buttonColor} onClick={() => setIsEnabledInput({ ...isEnabledInput, username: !isEnabledInput.username })}>
                                    <FaPencilAlt />
                                </Button>}
                        </HStack>
                        <HStack>
                            <FormLabel width={isEditing ? 295 : 350}>Jelszó: </FormLabel>
                            <Input borderColor='#767676' type='password' disabled={!isEnabledInput.password} value={newPwd} onChange={(e) => { setNewPwd(e.target.value) }} />
                            {isEditing &&
                                <Button _hover={{ backgroundColor: buttonHover }} backgroundColor={buttonBg} color={buttonColor} onClick={() => {
                                    if (!isEnabledInput.password) setNewPwd("")
                                    setIsEnabledInput({ ...isEnabledInput, password: !isEnabledInput.password })
                                }}>
                                    <FaPencilAlt />
                                </Button>}
                        </HStack>
                        <HStack my={10}>
                            <Button _hover={{ backgroundColor: buttonHover }} backgroundColor={buttonBg} color={buttonColor} onClick={() => {
                                setIsEditing(!isEditing)
                                setNewPwd("KetajtosSzekreny")
                                setIsEnabledInput({ email: false, username: false, password: false })
                                setMember(oldMember)
                            }}>
                                {!isEditing && <FaPencilAlt />}
                                <Text mb={0} mx={3}>{isEditing ? 'Mégse' : 'Szerkesztés'}</Text>
                            </Button>
                            {
                                isEditing &&
                                <Button _hover={{ backgroundColor: buttonHover }} backgroundColor={buttonBg} color={buttonColor} onClick={() => {
                                    setIsEditing(!isEditing)
                                    onOpen()
                                }}>
                                    <Text mb={0} mx={3}>Mentés</Text>
                                </Button>
                            }
                        </HStack>
                    </VStack>
                }

                <HStack >
                    <FormLabel width={350}>{t('phone')}: </FormLabel>
                    <Input borderColor='#767676' disabled value={member.phoneNumber} />
                </HStack>
                {(isPresident || isOwnProfile) &&
                    <HStack>
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
                        <HStack>
                            <FormLabel width={350}>{t('idNumber')}: </FormLabel>
                            <Input borderColor='#767676' disabled value={oldMember.idNumber} />
                        </HStack>
                        <HStack>
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
                            Adatok módosítása
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            A módosítások mentéséhez adja meg mostani jelszavát!
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
                                if (password) {
                                    apiClient
                                        .post('/members/me/credentials', {
                                            member,
                                            headers: {
                                                'x-current-pass': password,
                                            },
                                        })
                                        .then((res) => res.data)
                                }
                            }} ml={3}>
                                Mentés
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