import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import apiClient from '../../services/apiClient'
import { User } from '../../hooks/useLogin'
import { Button, Checkbox, FormLabel, HStack, Heading, Input, Text, VStack, useColorModeValue } from '@chakra-ui/react'
import useAuth from '../../hooks/useAuth'
import { useTranslation } from 'react-i18next'

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
    }, [])

    const isPresident = user?.roles?.includes('president') || false
    return (
        <VStack spacing={6} mt={10}>
            <Heading>{member.name || 'Ismeretlen'}{t('userData')}</Heading>
            {member?.roles?.includes('president') && <Heading as='h3' fontSize={30}>{t('common:president')}</Heading>}
            <VStack maxW='90vw'>
                <Text fontSize={20}><b>{t('contacts')}:</b></Text>
                <HStack >
                    <FormLabel width={350}>{t('email')}: </FormLabel>
                    <Input borderColor='#767676' disabled defaultValue={member.email} />
                </HStack>
                <HStack >
                    <FormLabel width={350}>{t('phone')}: </FormLabel>
                    <Input borderColor='#767676' disabled defaultValue={member.phoneNumber} />
                </HStack>
                {isPresident &&
                    <HStack>
                        <FormLabel width={350}>{t('address')}: </FormLabel>
                        <Input borderColor='#767676' disabled defaultValue={member.address} />
                    </HStack>
                }
            </VStack>
            <VStack mt={10} maxW='90vw'>
                <Checkbox my={10} isChecked={member.isRegistered} disabled>{t('finishedRegistration')}</Checkbox>
                {isPresident &&
                    <>
                        <HStack>
                            <FormLabel width={350}>{t('idNumber')}: </FormLabel>
                            <Input borderColor='#767676' disabled defaultValue={member.idNumber} />
                        </HStack>
                        <HStack>
                            <FormLabel width={350}>{t('guardNumber')}: </FormLabel>
                            <Input borderColor='#767676' disabled defaultValue={member.guardNumber} />
                        </HStack>
                    </>

                }
            </VStack>

            <Button mb={8} _hover={{ backgroundColor: buttonHover }} backgroundColor={buttonBg} color={buttonColor} onClick={() => navigate('/members')}>{t('common:back')}</Button>

        </VStack>

    )
}

export default MemberDetail