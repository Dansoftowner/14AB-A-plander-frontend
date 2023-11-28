import { Button, Divider, FormControl, FormErrorMessage, FormLabel, HStack, Heading, Input, InputGroup, InputLeftAddon, InputRightElement, Stack, Text } from "@chakra-ui/react"
import { ChangeEvent, useState } from "react"
import { useTranslation } from "react-i18next"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from 'zod'
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";



export const RegisterForm = () => {
    const { i18n, t } = useTranslation()

    const [show, setShow] = useState(false)
    const setPasswordVisibility = () => setShow(!show)


    const schema = z.object({
        username: z.string().min(5, { message: i18n.t('regForm-zodUsername') }).max(20),
        password: z.string().min(8, { message: t('regForm-zodPasswordLength') }).refine((str) => /[A-Z]/.test(str), { message: t('regForm-zodPassword') }).refine(str => /[0-9]/.test(str), { message: t('regForm-zodPassword') }),
        repeatedPassword: z.string(),
        fullName: z.string().min(5, { message: t('regForm-zodFullname') }).max(40).refine(str => /^[^\d]+\s+[^\d]+(\s[^\d]+)*$/g.test(str), { message: t('regForm-zodInvalidName') })
            .refine(str => !/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(str), { message: t('regForm-zodInvalidName') }),
        address: z.string().min(5, { message: t('regForm-zodAddress') }).refine(str => /[0-9]/.test(str), { message: t('regForm-zodAddress') }),
        idNumber: z.string().min(1),
        guardNumber: z.string().min(1, { message: t('regForm-zodGuardNumber') }).max(13).refine(str => /\d{2}\/\d{4}\/\d{5}/.test(str), { message: t('regForm-zodGuardNumber') }),
        emailAddress: z.string().refine(str => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(str), { message: t('regForm-zodEmail') }),
        phoneNumber: z.string().min(1),
    })
        .refine(data => data.password == data.repeatedPassword, {
            message: t('regForm-zodRepeatedPwd'),
            path: ["repeatedPassword"]
        })


    type RegForm = z.infer<typeof schema>

    const { register, handleSubmit, formState: { errors } } = useForm<RegForm>({ resolver: zodResolver(schema) })


    const isVisible = () => (show ? <IoMdEyeOff /> : <IoMdEye />)

    const lengths: number[] = [2, 7]
    let prevValue = 0
    const guardNumberHandler = (e: ChangeEvent<HTMLInputElement>) => {
        if (lengths.includes(e.target.value.length) && (prevValue != 2 && prevValue != 7)) e.target.value += '/'
        if (e.target.value.length >= 1) prevValue = e.target.value.length - 1
    }

    console.log(errors.guardNumber?.message);



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
                <div className="mb-3">
                    <Text>{t('regForm-fullname')}</Text>
                    <Input {...register('fullName')} width={400} placeholder={t('regForm-fnPholder')} />
                </div>
                {errors.fullName && <p className="text-danger">{errors.fullName.message?.toString()}</p>}
                <div className="mb-3">
                    <Text>{t('regForm-address')}</Text>
                    <Input {...register('address')} width={400} placeholder={t('regForm-adPholder')} />
                </div>
                {errors.address && <p className="text-danger">{errors.address.message?.toString()}</p>}
                <div className="mb-3">
                    <Text>{t('regForm-idNumber')}</Text>
                    <Input {...register('idNumber')} width={400} placeholder={t('regForm-idcPholder')} />
                </div>
                {errors.idNumber && <p className="text-danger">{errors.idNumber.message?.toString()}</p>}
                <div className="mb-3">
                    <Text>{t('regForm-guardNumber')}</Text>
                    <Input {...register('guardNumber')} type='tel' width={400} maxLength={13} onChange={(e) => guardNumberHandler(e)}
                        placeholder={t('regForm-guardNumPholder')} />
                </div>
                {errors.guardNumber && <p className="text-danger">{errors.guardNumber.message?.toString()}</p>}
                <div className="mb-3">
                    <FormControl isRequired={true}>
                        <FormLabel>{t('regForm-email')}</FormLabel>
                        <Input {...register('emailAddress')} width={400} placeholder={t('regForm-emaPholder')} />
                        {<FormErrorMessage>Kötelező megadni.</FormErrorMessage>}
                    </FormControl>
                </div>
                {errors.emailAddress && <p className="text-danger">{errors.emailAddress.message?.toString()}</p>}
                <div className="mb-3">
                    <Text>{t('regForm-phone')}</Text>
                    <InputGroup>
                        <InputLeftAddon children='+36' />
                        <Input {...register('phoneNumber')} width={340} type='tel' placeholder={t('regForm-phnPholder')} />
                    </InputGroup>
                </div>
                {errors.phoneNumber && <p className="text-danger">{errors.phoneNumber.message?.toString()}</p>}

                <button className="btn btn-primary">{t('regForm-regButton')}</button>
            </Stack>
        </form >
    )
}
