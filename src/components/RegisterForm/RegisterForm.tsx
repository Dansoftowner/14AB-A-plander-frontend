import { Divider, HStack, Heading, Input, Stack, Text } from "@chakra-ui/react"
import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from 'zod'
import { regSchema } from "./inputSchema"
import FormInput from "./FormInput"
import PasswordInput from "./PasswordInput"
import { useRegister } from "../../hooks/useRegister"
import { useLocation, useParams, useRoutes } from "react-router-dom"
import apiClient from "../../services/apiClient"
import { User } from "../../hooks/useMember"




export const RegisterForm = () => {
    const { t } = useTranslation()
    const inputSchema = useMemo(() => regSchema(t), [t])

    const { id, registrationToken } = useParams();

    type RegForm = z.infer<typeof inputSchema>

    const [valid, setValid] = useState(false)
    const [user, setUser] = useState({} as User)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetch = () => {
            apiClient.get(`/members/register/${id}/${registrationToken}`).then(res => {
                if (res.status === 200) {
                    setValid(true)
                    setUser(res.data)
                } else {
                    setError(res.data.message)
                }
            }).catch(err => {
                setError(err.response?.data.message)
            })
        }
        fetch()
    }, [valid])

    const { register, handleSubmit, formState: { errors } } = useForm<RegForm>({ resolver: zodResolver(inputSchema) })

    if (valid) return (
        <form className="mx-auto container mt-3" onInvalid={(e) => console.log(e)} onSubmit={handleSubmit((e) =>
            console.log(e)

        )}>

            <Stack>
                <Heading alignSelf='center' marginBottom={10}>{t('register-header')}</Heading>
            </Stack>

            <HStack marginBottom={5} alignContent='center'>
                <Divider borderColor='grey' />
                <Heading minWidth='fit-content' noOfLines={1} alignSelf='center' alignContent='center' size='lg'>{t('login-details')}</Heading>
                <Divider borderColor='grey' />
            </HStack>

            <Stack marginBottom={5} align='center'>
                <FormInput register={register} name="username" i18nPlaceHolder="regForm-usernamePholder" required errors={errors} i18nTitle="username" />

                <PasswordInput register={register} name="password" errors={errors} required i18nPlaceHolder="regForm-pwdPholder" i18nTitle="password" />

                <FormInput register={register} name="repeatedPassword" passwordConfirm i18nPlaceHolder="regForm-repeatPwd" required={true} errors={errors} />
            </Stack>

            <HStack marginBottom={5}>
                <Divider borderColor='gray' />
                <Heading minWidth='fit-content' size='lg'>{t('regForm-persInfo')}</Heading>
                <Divider borderColor='gray' />
            </HStack>

            <Stack marginBottom={5} align='center'>
                <FormInput register={register} value={user.name} name="fullName" i18nPlaceHolder="regForm-fnPholder" i18nTitle="regForm-fullname" required={true} errors={errors} />
                <FormInput register={register} value={user.address} name="address" i18nPlaceHolder="regForm-adPholder" i18nTitle="regForm-address" required={true} errors={errors} />

                <FormInput register={register} value={user.idNumber} name="idNumber" i18nPlaceHolder="regForm-idcPholder" i18nTitle="regForm-idNumber" required={true} errors={errors} />

                <FormInput register={register} guard value={user.guardNumber} name="guardNumber" i18nPlaceHolder="regForm-guardNumPholder" i18nTitle="regForm-guardNumber" required={false} errors={errors} />

                <FormInput register={register} tel value={user.phoneNumber} name="phoneNumber" i18nPlaceHolder="regForm-phnPholder" i18nTitle="regForm-phone" required={true} errors={errors} />

                <button name="submitbtn" type="submit" className="btn btn-primary">{t('regForm-regButton')}</button>
            </Stack>
        </form >
    )
    return <Text fontSize='xxx-large' color='red'>{error}</Text>
}
