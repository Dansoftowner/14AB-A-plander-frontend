import {
    FormControl, FormLabel, Input, FormErrorMessage, InputGroup, InputLeftAddon, HStack, VStack, Menu, InputLeftElement,
} from '@chakra-ui/react'
import { t } from 'i18next'
import { FormEvent, useMemo, useState } from 'react'
import {
    FieldErrors,
    FieldValues,
    Path,
    UseFormRegister,
    useForm,
} from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { regSchema } from './inputSchema'
import PhoneDropdownList from '../PhoneDropdownList/PhoneDropdownList'
import { phoneMap, PhoneFormat } from '../PhoneDropdownList/phones'
import { FaRegUser } from "react-icons/fa";
import { useTranslation } from 'react-i18next'


interface Props<FormData extends FieldValues> {
    required: boolean
    i18nTitle?: string
    i18nPlaceHolder: string
    name: Path<FormData>
    register: UseFormRegister<FormData>
    errors: FieldErrors
    tel?: boolean
    guard?: boolean
    passwordConfirm?: boolean
    login?: boolean,
    _onChange?: (e: any) => void,
    value?: string
}

const FormInput = <FormData extends FieldValues>({
    register,
    guard,
    tel,
    passwordConfirm,
    errors,
    name,
    required,
    i18nTitle,
    i18nPlaceHolder,
    login,
    _onChange,
    value
}: Props<FormData>) => {
    const { t } = useTranslation('register')
    const inputSchema = useMemo(() => regSchema(t), [t])
    type RegForm = z.infer<typeof inputSchema>
    const {
        formState: { },
    } = useForm<RegForm>({ resolver: zodResolver(inputSchema) })

    const [phone, setPhone] = useState<PhoneFormat>({
        src: '/assets/flags/hu.svg',
        prefix: '+36',
        length: 7,
    })
    const error = errors?.[name]?.message as string | undefined
    const isError = error != undefined

    const lengths: number[] = [2, 7]
    let prevValue = 0
    const guardNumberHandler = (e: FormEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement
        if (
            lengths.includes(target.value.length) &&
            prevValue != 2 &&
            prevValue != 7
        )
            target.value += '/'
        if (target.value.length >= 1) prevValue = target.value.length - 1
    }

    const spacePos = [2, 6]
    const length = phone.length + spacePos.length + 2

    let prevTelValue = 0
    const telHandler = (e: FormEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement
        if (
            spacePos.includes(target.value.length) &&
            prevTelValue != 2 &&
            prevTelValue != 6
        )
            target.value += ' '
        if (target.value.length >= 1) prevTelValue = target.value.length - 1
    }

    if (login) {
        return (
            <FormControl isRequired={required} isInvalid={isError} width={400} maxW='90vw'>
                {i18nTitle && <FormLabel>{t(i18nTitle)}</FormLabel>
                }
                <InputGroup>
                    <InputLeftElement>
                        <FaRegUser />
                    </InputLeftElement>
                    <Input
                        {...register(name, { required })}
                        placeholder={t(i18nPlaceHolder)}
                        name={name}
                        borderRadius={10}
                        fontSize={20}
                        h={10}
                        autoComplete="off"
                        onChange={_onChange}
                    />
                </InputGroup>
                {isError && <FormErrorMessage> {error} </FormErrorMessage>}
            </FormControl >
        )
    }

    return (
        <div className="mb-3">
            <FormControl isRequired={required} isInvalid={isError}>
                {i18nTitle && <FormLabel>{t(i18nTitle)}</FormLabel>}

                <VStack maxW={400}>
                    <InputGroup as={Menu} alignItems="start">
                        <HStack justifyContent="space-evenly">
                            <Input
                                {...register(name)}
                                width={tel ? 240 : 400}
                                maxLength={
                                    guard ? 13 : tel && phone.prefix == '+36' ? length : 20
                                }
                                placeholder={t(i18nPlaceHolder)}
                                type={passwordConfirm ? 'password' : 'text'}
                                onChangeCapture={(e) => {
                                    if (guard) guardNumberHandler(e)
                                    if (tel && phone.prefix == '+36') telHandler(e)
                                }}
                                defaultValue={value}
                            />
                        </HStack>
                    </InputGroup>

                    {isError && (
                        <FormErrorMessage textAlign="center">{error}</FormErrorMessage>
                    )}
                </VStack>
            </FormControl>
        </div>
    )
}

export default FormInput
