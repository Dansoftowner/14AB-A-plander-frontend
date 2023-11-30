import { Button, Divider, HStack, Heading, Input, InputGroup, InputRightElement, Stack, Text } from "@chakra-ui/react"
import { ChangeEvent, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from 'zod'
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { schema } from "./inputSchema"
import FormInput from "./FormInput"



export const RegisterForm = () => {
    const { t } = useTranslation()
    const inputSchema = useMemo(() => schema(t), [t])

    const [show, setShow] = useState(false)
    const setPasswordVisibility = () => setShow(!show)

    type RegForm = z.infer<typeof inputSchema>

    const { register, handleSubmit, formState: { errors } } = useForm<RegForm>({ resolver: zodResolver(inputSchema) })


    const isVisible = () => (show ? <IoMdEyeOff /> : <IoMdEye />)

    const lengths: number[] = [2, 7]
    let prevValue = 0
    const guardNumberHandler = (e: ChangeEvent<HTMLInputElement>) => {
        if (lengths.includes(e.target.value.length) && (prevValue != 2 && prevValue != 7)) e.target.value += '/'
        if (e.target.value.length >= 1) prevValue = e.target.value.length - 1
    }

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
                <div className="mb-3">
                    <Text>{t('username')}</Text>
                    <Input {...register('username')} width={400} placeholder={t('regForm-usernamePholder')} />
                </div>
                {errors.username && <p className='text-danger'>{errors.username.message?.toString()}</p>}

                <div className="mb-3">
                    <Text>{t('password')}</Text>
                    <InputGroup size='md'>
                        <Input {...register('password')}
                            pr='4.5rem'
                            type={show ? 'text' : 'password'}
                            placeholder={t('regForm-pwdPholder')} width={400}
                        />
                        <InputRightElement pr={1}>
                            <Button h='1.75rem' size='sm' onClick={setPasswordVisibility}>
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

                {errors.password && <p className='text-danger'>{errors.password.message?.toString()}</p>}
                {errors.repeatedPassword && <p className='text-danger'>{errors.repeatedPassword.message?.toString()}</p>}
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

                <FormInput register={register} name="guardNumber" i18nPlaceHolder="regForm-guardNumPholder" i18nTitle="regForm-guardNumber" required={false} errors={errors} />

                <FormInput register={register} tel name="phoneNumber" i18nPlaceHolder="regForm-phnPholder" i18nTitle="regForm-phone" required={true} errors={errors} />

                <FormInput register={register} name="emailAddress" i18nPlaceHolder="regForm-emaPholder" i18nTitle="regForm-email" required={true} errors={errors} />

                <button className="btn btn-primary">{t('regForm-regButton')}</button>
            </Stack>
        </form >
    )
}
