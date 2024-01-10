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
        })
    }, [location.state.id])

    let oldMember = member

    const isPresident = user?.roles?.includes('president') || false
    const isOwnProfile = user._id == member._id
    const [isEditing, setIsEditing] = useState(false);

    const editHandler = () => {
        setIsEditing(!isEditing)

        if (isEditing) { }
    }

    return (
        <VStack spacing={6} mt={10}>
            <Heading>{member.name || 'Ismeretlen'}{t('userData')}</Heading>
            {member.roles?.includes('president') && <Heading as='h3' fontSize={30}>{t('common:president')}</Heading>}
            <VStack maxW='90vw'>
                <Text fontSize={20}><b>{t('contacts')}:</b></Text>
                <HStack >
                    <FormLabel width={350}>{t('email')}: </FormLabel>
                    <Input borderColor='#767676' disabled={!isEditing} value={oldMember.email} />
                </HStack>
                <HStack >
                    <FormLabel width={350}>{t('phone')}: </FormLabel>
                    <Input borderColor='#767676' disabled={!isEditing} defaultValue={oldMember.phoneNumber} />
                </HStack>
                {(isPresident || isOwnProfile) &&
                    <HStack>
                        <FormLabel width={350}>{t('address')}: </FormLabel>
                        <Input borderColor='#767676' disabled={!isEditing} defaultValue={oldMember.address} />
                    </HStack>
                }
                <HStack>
                    {isOwnProfile &&
                        <Button _hover={{ backgroundColor: buttonHover }} backgroundColor={buttonBg} color={buttonColor} my={10} onClick={editHandler}>
                            {!isEditing && <FaPencilAlt />}
                            <Text mb={0} mx={3}>{isEditing ? 'Mégse' : 'Szerkesztés'}</Text>
                        </Button>
                    }
                    {
                        isEditing &&
                        <Button _hover={{ backgroundColor: buttonHover }} backgroundColor={buttonBg} color={buttonColor} onClick={() => setIsEditing(!isEditing)}>
                            <Text mb={0} mx={3}>Mentés</Text>
                        </Button>
                    }
                </HStack>
            </VStack>
            <VStack mt={10} maxW='90vw'>
                <Checkbox my={10} isChecked={oldMember.isRegistered} disabled>{t('finishedRegistration')}</Checkbox>
                {(isPresident || isOwnProfile) &&
                    <>
                        <HStack>
                            <FormLabel width={350}>{t('idNumber')}: </FormLabel>
                            <Input borderColor='#767676' disabled defaultValue={oldMember.idNumber} />
                        </HStack>
                        <HStack>
                            <FormLabel width={350}>{t('guardNumber')}: </FormLabel>
                            <Input borderColor='#767676' disabled defaultValue={oldMember.guardNumber} />
                        </HStack>
                    </>
                }
            </VStack>

            <Button mb={8} _hover={{ backgroundColor: buttonHover }} backgroundColor={buttonBg} color={buttonColor} onClick={() => navigate('/members')}><Text mb={0}>{t('common:back')}</Text></Button>

        </VStack>

    )
}

export default MemberDetail