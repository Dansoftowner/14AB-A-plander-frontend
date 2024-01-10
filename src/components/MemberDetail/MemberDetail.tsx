import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import apiClient from '../../services/apiClient'
import { User } from '../../hooks/useLogin'
import { Button, Checkbox, FormLabel, HStack, Heading, Input, Text, VStack, useColorModeValue } from '@chakra-ui/react'
import useAuth from '../../hooks/useAuth'
import { useTranslation } from 'react-i18next'

import { FaPencilAlt } from "react-icons/fa";


const MemberDetail = () => {
    const buttonBg = useColorModeValue('#0078d7', '#fde74c')
    const buttonColor = useColorModeValue('#ffffff', '#004881')
    const buttonHover = useColorModeValue('#0078b0', '#fde7af')

    const location = useLocation()
    const navigate = useNavigate()
    const { user } = useAuth()
    const { t } = useTranslation('register')

    const [member, setMember] = useState({} as User)
    const [oldMember, setOldMember] = useState({} as User)
    const [newPwd, setNewPwd] = useState("KetajtosSzekreny")

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
                                    setNewPwd("")
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
                                <Button _hover={{ backgroundColor: buttonHover }} backgroundColor={buttonBg} color={buttonColor} onClick={() => setIsEditing(!isEditing)}>
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

            <Button mb={8} _hover={{ backgroundColor: buttonHover }} backgroundColor={buttonBg} color={buttonColor} onClick={() => navigate('/members')}><Text mb={0}>{t('common:back')}</Text></Button>

        </VStack>

    )
}

export default MemberDetail