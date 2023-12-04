import {
    FormControl,
    FormLabel,
    Input,
    FormErrorMessage,
    InputGroup,
    InputLeftAddon,
    HStack,
    VStack,
} from '@chakra-ui/react'
import { t } from 'i18next'
import { FormEvent, Fragment, useMemo, useState } from 'react'
import {
    FieldErrors,
    FieldValues,
    Path,
    UseFormRegister,
    useForm,
} from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { schema } from './inputSchema'
import PhoneDropdownList from '../PhoneDropdownList/PhoneDropdownList'
import { phoneMap, PhoneFormat } from '../PhoneDropdownList/phones'

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
}: Props<FormData>) => {
    const inputSchema = useMemo(() => schema(t), [t])
    type RegForm = z.infer<typeof inputSchema>
    const {
        formState: { },
    } = useForm<RegForm>({ resolver: zodResolver(inputSchema) })

    const [phone, setPhone] = useState<PhoneFormat>({
        src: '',
        prefix: '',
        length: 0,
    })
    const [input, setInput] = useState('')
    const error = errors?.[name]?.message as string | undefined
    const isEmpty = input === '' && required
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

    return (
        <div className="mb-3">
            <FormControl isRequired={required} isInvalid={isError}>
                {i18nTitle && <FormLabel>{t(i18nTitle)}</FormLabel>}

                <VStack maxW={400}>
                    <InputGroup as={Fragment} alignItems='start'>
                        <HStack justifyContent='space-evenly'>

                            {tel &&
                                <InputLeftAddon width={150} borderRadius={10} children={
                                    <PhoneDropdownList
                                        selectedPhone={phone}
                                        items={phoneMap}
                                        selectionChange={(p) => setPhone(p)}
                                    />
                                } />
                            }
                            <Input
                                {...register(name)}
                                width={tel ? 240 : 400}
                                maxLength={guard ? 13 : undefined}
                                placeholder={t(i18nPlaceHolder)}
                                type={passwordConfirm ? 'password' : 'text'}
                                onChangeCapture={(e) => {
                                    setInput((e.target as HTMLInputElement).value)
                                    if (guard) guardNumberHandler(e)
                                }}
                            />
                        </HStack>
                    </InputGroup>

                    {(isEmpty || isError) && (
                        <FormErrorMessage textAlign='center'>
                            {error}
                        </FormErrorMessage>
                    )}
                </VStack>
            </FormControl>
        </div >
    )
}

export default FormInput
