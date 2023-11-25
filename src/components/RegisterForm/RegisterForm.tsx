import { Button, Divider, HStack, Heading, Input, InputGroup, InputLeftAddon, InputRightElement, Stack, Text } from "@chakra-ui/react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from 'zod'
// type RegisterForm = z.infer<typeof schema>

export const RegisterForm = () => {
    const { i18n, t } = useTranslation()

    const [show, setShow] = useState(false)
    const setPasswordVisibility = () => setShow(!show)


    const schema = z.object({
        username: z.string().min(5, { message: i18n.t('regForm-zodUsername') }).max(20),
        password: z.string().min(8, { message: t('regForm-zodPasswordLength') }).refine((str) => /[A-Z]/.test(str), { message: t('regForm-zodPassword') }).refine(str => /[0-9]/.test(str), { message: t('regForm-zodPassword') }),
        repeatedPassword: z.string(),
        fullName: z.string().min(5, { message: t('regForm-zodFullname') }).max(40),
        address: z.string().min(5, {message: t('regForm-zodAddress')}).refine(str => /[0-9]/.test(str), { message: t('regForm-zodAddress') }),
        idNumber: z.number().int({message: t('regForm-zodIdNumber')}).gte(10000000000, {message: t('regForm-zodIdNumber')}).lte(9999999999, {message: t('regForm-zodIdNumber')}),
        emailAddress: z.string().refine(str => /^[\w-\.]+@([\w-]+\.)[\w-]{2,4}$/g.test(str), { message: t('regForm-zodEmail') }),
        phoneNumber: z.string()
    }).refine(data => data.password === data.repeatedPassword, {
        message: t('regForm-zodRepeatedPwd'),
        path: ["repeatedPassword"]
    })


    type RegForm = z.infer<typeof schema>

    const { register, handleSubmit, formState: { errors } } = useForm<RegForm>({ resolver: zodResolver(schema) })


    const isVisible = () => (show ? t('regForm-hidePwd') : t('regForm-showPwd'))

    const setMinWidth = (obj: string) => {
        if (i18n.language == 'hu' && obj == 'login') return 230
        if (i18n.language == 'en' && obj == 'login') return 190

        if (i18n.language == 'hu' && obj == 'personal') return 260
        if (i18n.language == 'en' && obj == 'personal') return 320
    }

    return (
        <form className="mx-auto container mt-3" onSubmit={handleSubmit((e) => console.log(e))}>
            <Heading marginBottom={10}>{t('register-header')}</Heading>
            <HStack marginBottom={5}>
                <Heading minWidth={setMinWidth('login')} size='lg'>{t('login-details')}</Heading>
                <Divider borderColor={"grey"}/>
            </HStack>
            <Stack marginBottom={5}>
                <div className="mb-3">
                    <Text>{t('username')}</Text>

                    <Input {...register('username')} width={400} placeholder={t('regForm-usernamePholder')} />
                    {errors.username && <p className='text-danger'>{errors.username.message?.toString()}</p>}
                </div>
                <Text>{t('password')}</Text>
                <HStack justify='start'>
                    <div className="mb-3">
                        <InputGroup size='md'>
                            <Input {...register('password')}
                                pr='4.5rem'
                                type={show ? 'text' : 'password'}
                                placeholder={t('regForm-pwdPholder')} width={400}
                            />
                            <InputRightElement width='4.5rem'>
                                <Button h='1.75rem' size='sm' margin={1} onClick={setPasswordVisibility}>
                                    {isVisible()}
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                    </div>
                    <div className="mb-3">
                        <InputGroup size='md'>
                            <Input {...register('repeatedPassword')}
                                pr='4.5rem'
                                type={"password"}
                                placeholder={t('regForm-repeatPwd')} width={400}
                            />
                        </InputGroup>
                    </div>
                </HStack>
                {errors.password && <p className='text-danger'>{errors.password.message?.toString()}</p>}
                {errors.repeatedPassword && <p className='text-danger'>{errors.repeatedPassword.message?.toString()}</p>}
            </Stack>
            <HStack marginBottom={5}>
                <Heading minWidth={setMinWidth('personal')} size='lg'>{t('regForm-persInfo')}</Heading>
                <Divider borderColor={"gray"} />
            </HStack>
            <Stack marginBottom={5}>
                <div className="mb-3">
                    <Text>{t('regForm-fullname')}</Text>
                    <Input {...register('fullName')} width={400} placeholder={t('regForm-fnPholder')} />
                </div>
                <div className="mb-3">
                    <Text>{t('regForm-address')}</Text>
                    <Input {...register('address')} width={400} placeholder={t('regForm-adPholder')} />
                </div>
                <div className="mb-3">
                    <Text>{t('regForm-idNumber')}</Text>
                    <Input {...register('idNumber')} width={400} placeholder={t('regForm-idcPholder')} />
                </div>
                <div className="mb-3">
                    <Text>{t('regForm-email')}</Text>
                    <Input {...register('emailAddress')} width={400} placeholder={t('regForm-emaPholder')} />
                </div>
                {errors.emailAddress && <p className="text-danger">{errors.emailAddress.message?.toString()}</p>}
                <div className="mb-3">
                    <Text>{t('regForm-phone')}</Text>
                    <InputGroup>
                        <InputLeftAddon children='+36' />
                        <Input {...register('phoneNumber')} width={340} type='tel' placeholder={t('regForm-phnPholder')} />
                    </InputGroup>
                </div>
            </Stack>
            <button className="btn btn-primary">{t('regForm-regButton')}</button>
        </form>
    )
}