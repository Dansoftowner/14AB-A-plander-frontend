import { Box, Button, Divider, FormControl, FormLabel, HStack, Heading, InputGroup, Menu, Stack, VStack, useColorModeValue, useToast } from "@chakra-ui/react"
import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from 'zod'
import { regSchema } from "./inputSchema"
import FormInput from "./FormInput"
import PasswordInput from "./PasswordInput"
import { useNavigate, useParams } from "react-router-dom"
import apiClient from "../../services/apiClient"
import ErrorPage from "../ErrorPage/ErrorPage"
import { UserWithAssociation } from "../../hooks/useLogin"
import NavBar from "../NavBar/NavBar"
import PhoneDropdownList from "../PhoneDropdownList/PhoneDropdownList"
import { PhoneFormat, phoneMap } from "../PhoneDropdownList/phones"




export const RegisterForm = () => {
    const { t } = useTranslation('register')
    const inputSchema = useMemo(() => regSchema(t), [t])

    const buttonBg = useColorModeValue('#0078d7', '#fde74c')
    const buttonHover = useColorModeValue('#0078b0', '#fde7af')
    const buttonColor = useColorModeValue('#ffffff', '#004881')

    const { id, registrationToken } = useParams();

    type RegForm = z.infer<typeof inputSchema>

    const [valid, setValid] = useState(false)
    const [user, setUser] = useState({} as UserWithAssociation)
    const [error, setError] = useState('')
    const [phone, setPhone] = useState<PhoneFormat>({
        src: '/assets/flags/hu.svg',
        prefix: '+36',
        length: 7,
    })

    const registerToast = useToast()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetch = () => {
            apiClient.get(`/members/register/${id}/${registrationToken}`).then(res => {
                if (res.status === 200) {
                    setValid(true)
                    setUser(res.data)
                    setLoading(false)
                } else {
                    setError(res.data.message)
                    setLoading(false)
                }
            }).catch(err => {
                setError(err.response?.data.message)
                setLoading(false)
            })
        }
        fetch()
    }, [])
    if (user.phoneNumber) {
        let phone = user.phoneNumber
        phone = phone.replace('-', ' ')
        let prefix = phone.split(' ')[0]
        phone = phone.substring(prefix.length)
        user.phoneNumber = phone
    }

    const { register, handleSubmit, formState: { errors } } = useForm<RegForm>({ resolver: zodResolver(inputSchema) })

    if (valid && !loading) return (
        <>
            <NavBar />
            <form className="mx-auto container" onSubmit={handleSubmit((postUser) => {
                type dataOmit = Omit<typeof postUser, "repeatedPassword">
                const post: dataOmit = {
                    address: postUser.address,
                    name: postUser.name,
                    phoneNumber: phone.prefix + " " + postUser.phoneNumber,
                    guardNumber: postUser.guardNumber == "" ? undefined : postUser.guardNumber,
                    idNumber: postUser.idNumber,
                    username: postUser.username,
                    password: postUser.password
                }
                apiClient.post(`/members/register/${id}/${registrationToken}`, post)
                    .then(res => {
                        if (res.status === 200) {
                            registerToast({
                                title: res.status === 200 ? t('success') : t('error'),
                                status: res.status === 200 ? 'success' : 'error',
                                duration: 9000,
                                isClosable: true,
                                position: 'top'
                            })
                            navigate('/login')
                        }
                    }).catch((err) => {
                        registerToast({
                            title: t('error'),
                            description: err.response?.data.message,
                            status: 'error',
                            duration: 9000,
                            isClosable: true,
                            position: 'top'
                        })
                    })
            }
            )}>

                <Stack maxW='90vw'>
                    <Heading alignSelf='center' marginBottom={1}>{t('regButton') + ": "}</Heading>
                    <Heading textAlign='center' alignSelf='center' mt={10} marginBottom={10}>{user.association.name || t('header')}</Heading>
                </Stack>

                <HStack marginBottom={5} alignContent='center'>
                    <Divider borderColor='grey' />
                    <Heading minWidth='fit-content' noOfLines={1} alignSelf='center' alignContent='center' size='lg'>{t('login-details')}</Heading>
                    <Divider borderColor='grey' />
                </HStack>

                <Stack marginBottom={5} align='center'>
                    <FormInput register={register} name="username" i18nPlaceHolder="usernamePholder" required errors={errors} i18nTitle="username" />

                    <PasswordInput register={register} name="password" errors={errors} required i18nPlaceHolder="pwdPholder" i18nTitle="password" />

                    <FormInput register={register} name="repeatedPassword" passwordConfirm i18nPlaceHolder="repeatPwd" required={true} errors={errors} />
                </Stack>

                <HStack marginBottom={5}>
                    <Divider borderColor='gray' />
                    <Heading minWidth='fit-content' size='lg'>{t('persInfo')}</Heading>
                    <Divider borderColor='gray' />
                </HStack>

                <Stack marginBottom={5} align='center'>
                    <FormInput register={register} value={user.name} name="name" i18nPlaceHolder="fnPholder" i18nTitle="fullname" required={true} errors={errors} />
                    <FormInput register={register} value={user.address} name="address" i18nPlaceHolder="adPholder" i18nTitle="address" required={true} errors={errors} />

                    <FormInput register={register} value={user.idNumber} name="idNumber" i18nPlaceHolder="idcPholder" i18nTitle="idNumber" required={true} errors={errors} />

                    <FormInput register={register} guard value={user.guardNumber} name="guardNumber" i18nPlaceHolder="guardNumPholder" i18nTitle="guardNumber" required={false} errors={errors} />

                    <VStack>
                        <FormControl isRequired>
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
                                    <FormInput register={register} telPrefix={phone.prefix} value={user.phoneNumber?.trim()} name="phoneNumber" i18nPlaceHolder="phnPholder" i18nTitle="" required={true} errors={errors} />
                                </InputGroup>
                            </HStack>
                        </FormControl>
                    </VStack>

                    <Button name="submitbtn" type="submit" _hover={{ backgroundColor: buttonHover }} color={buttonColor} backgroundColor={buttonBg}>{t('regButton')}</Button>
                </Stack>
            </form >
        </>
    )
    if (!valid && !loading) return <ErrorPage status={404} message={error} />
}
