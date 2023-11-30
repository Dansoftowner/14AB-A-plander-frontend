import { Divider, HStack, Heading, Stack } from "@chakra-ui/react"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from 'zod'
import { schema } from "./inputSchema"
import FormInput from "./FormInput"
import PasswordInput from "./PasswordInput"



export const RegisterForm = () => {
    const { t } = useTranslation()
    const inputSchema = useMemo(() => schema(t), [t])

    type RegForm = z.infer<typeof inputSchema>

    const { register, handleSubmit, formState: { errors } } = useForm<RegForm>({ resolver: zodResolver(inputSchema) })

    return (
        <form className="mx-auto container mt-3" onSubmit={handleSubmit((e) => console.log(e))}>
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
                <FormInput register={register} name="fullName" i18nPlaceHolder="regForm-fnPholder" i18nTitle="regForm-fullname" required={true} errors={errors} />

                <FormInput register={register} name="address" i18nPlaceHolder="regForm-adPholder" i18nTitle="regForm-address" required={true} errors={errors} />

                <FormInput register={register} name="idNumber" i18nPlaceHolder="regForm-idcPholder" i18nTitle="regForm-idNumber" required={true} errors={errors} />

                <FormInput register={register} guard name="guardNumber" i18nPlaceHolder="regForm-guardNumPholder" i18nTitle="regForm-guardNumber" required={false} errors={errors} />

                <FormInput register={register} tel name="phoneNumber" i18nPlaceHolder="regForm-phnPholder" i18nTitle="regForm-phone" required={true} errors={errors} />

                <FormInput register={register} name="emailAddress" i18nPlaceHolder="regForm-emaPholder" i18nTitle="regForm-email" required={true} errors={errors} />

                <button className="btn btn-primary">{t('regForm-regButton')}</button>
            </Stack>
        </form >
    )
}
