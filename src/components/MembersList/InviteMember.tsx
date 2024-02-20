import { useMemo, useState } from 'react'
import useAuth from '../../hooks/useAuth'
import { Navigate } from 'react-router-dom'
import { Box, Button, FormControl, FormLabel, HStack, Heading, InputGroup, Menu, Stack, VStack, useColorModeValue, useToast } from '@chakra-ui/react'
import FormInput from '../RegisterForm/FormInput'
import { inviteSchema } from '../RegisterForm/inputSchema'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import apiClient from '../../services/apiClient'
import PhoneDropdownList from '../PhoneDropdownList/PhoneDropdownList'
import { PhoneFormat, phoneMap } from '../PhoneDropdownList/phones'

const InviteMember = () => {
    const buttonBg = useColorModeValue('#0078d7', '#fde74c')
    const buttonColor = useColorModeValue('#ffffff', '#004881')
    const buttonHover = useColorModeValue('#0078b0', '#fde7af')

    const { user } = useAuth()
    const inviteToast = useToast()

    const [phone, setPhone] = useState<PhoneFormat>({
        src: '/assets/flags/hu.svg',
        prefix: '+36',
        length: 7,
    })

    const { t } = useTranslation('register')
    const inputSchema = useMemo(() => inviteSchema(t), [t])
    type InviteForm = z.infer<typeof inputSchema>
    const { register, handleSubmit, formState: { errors } } = useForm<InviteForm>({ resolver: zodResolver(inputSchema) })


    if (!user) return <Navigate to='/login' />
    if (!user.roles.includes('president')) return <Navigate to='/members' />
    return (
        <>
            <VStack mt={20} maxW='95vw' mx='auto' borderRadius={20} width='fit-content' padding={4}
                boxShadow='dark-lg'>
                <Heading textAlign='center' fontSize='2xl' fontWeight='bold'>{t('inviteMember')}</Heading>
                <form onSubmit={handleSubmit((e) => {
                    const invited = Object.fromEntries(Object.entries(e).filter(([_key, value]) => value != ""))
                    if (e.phoneNumber) invited.phoneNumber = phone.prefix + " " + e.phoneNumber
                    apiClient.post('/members', invited, {
                        headers: {
                            'x-plander-auth':
                                localStorage.getItem('token') || sessionStorage.getItem('token'),
                        }
                    }).then(res => {
                        inviteToast({
                            title: res.status === 202 ? t('inviteSuccess') : t('error'),
                            status: res.status === 202 ? 'success' : 'error',
                            duration: 9000,
                            isClosable: true,
                            position: 'top'
                        })
                    })
                        .catch(err => {
                            inviteToast({
                                title: t('error'),
                                status: 'error',
                                description: err.response.data.message,
                                duration: 9000,
                                isClosable: true,
                                position: 'top'
                            })
                        })
                })}>
                    <Stack mt={10} marginBottom={5} align='center' mx={5} maxW='95vw'>
                        <FormInput register={register} name="email" i18nPlaceHolder="emailPHolder" i18nTitle="email" required={true} errors={errors} />
                        <FormInput register={register} name="name" i18nPlaceHolder="fnPholder" i18nTitle="fullname" required={false} errors={errors} />
                        <FormInput register={register} name="address" i18nPlaceHolder="adPholder" i18nTitle="address" required={false} errors={errors} />

                        <FormInput register={register} name="idNumber" i18nPlaceHolder="idcPholder" i18nTitle="idNumber" required={false} errors={errors} />

                        <FormInput register={register} guard name="guardNumber" i18nPlaceHolder="guardNumPholder" i18nTitle="guardNumber" required={false} errors={errors} />

                        <VStack maxW='95vw'>
                            <FormControl isRequired={false}>
                                <FormLabel mr='auto'>{t('phone')}</FormLabel>
                                <HStack>
                                    <InputGroup as={Menu} alignItems='start'>
                                        <Box mb={4}>
                                            <PhoneDropdownList
                                                selectedPhone={phone}
                                                items={phoneMap}
                                                selectionChange={(p) => setPhone(p)}
                                            />
                                        </Box>
                                        <FormInput register={register} telPrefix={phone.prefix} name="phoneNumber" i18nPlaceHolder="phnPholder" required={false} errors={errors} />
                                    </InputGroup>
                                </HStack>
                            </FormControl>
                        </VStack>

                    </Stack>

                    <HStack justifyContent='center' mx={5}>
                        <Button mx='auto' boxShadow='md' name="submitbtn" type="submit" _hover={{ backgroundColor: buttonHover }} color={buttonColor} backgroundColor={buttonBg}>{t('member:inviteMember')}</Button>
                    </HStack>
                </form>
            </VStack >
        </>
    )
}

export default InviteMember