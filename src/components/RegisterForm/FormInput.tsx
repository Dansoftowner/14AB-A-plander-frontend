import { FormControl, FormLabel, Input, FormErrorMessage, InputGroup, InputLeftAddon, InputRightElement, Button } from '@chakra-ui/react'
import { t } from 'i18next'
import { FormEvent, ReactNode, useMemo, useState } from 'react'
import { FieldErrors, FieldValues, Path, UseFormRegister, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { schema } from "./inputSchema"

interface Props<FormData extends FieldValues> {
    required: boolean,
    i18nTitle?: string,
    i18nPlaceHolder: string,
    name: Path<FormData>
    register: UseFormRegister<FormData>,
    errors: FieldErrors
    tel?: boolean
    guard?: boolean
    passwordConfirm?: boolean
    password?: boolean
    children?: ReactNode
}

const FormInput = <FormData extends FieldValues>({ register, password, guard, tel, passwordConfirm, errors, name, required, i18nTitle, i18nPlaceHolder }: Props<FormData>) => {
    const inputSchema = useMemo(() => schema(t), [t])
    type RegForm = z.infer<typeof inputSchema>
    const { formState: { } } = useForm<RegForm>({ resolver: zodResolver(inputSchema) })


    const [input, setInput] = useState('')
    const error = errors?.[name]?.message as string | undefined
    const isEmpty = input === ''
    const isError = error != undefined

    const lengths: number[] = [2, 7]
    let prevValue = 0
    const guardNumberHandler = (e: FormEvent<HTMLInputElement>) => {
        const target = (e.target as HTMLInputElement)
        if (lengths.includes(target.value.length) && (prevValue != 2 && prevValue != 7)) target.value += '/'
        if (target.value.length >= 1) prevValue = target.value.length - 1
    }

    return (
        <div className="mb-3">
            <FormControl isRequired={required} isInvalid={isError || isEmpty}>
                {i18nTitle && <FormLabel>{t(i18nTitle)}</FormLabel>}
                <InputGroup>
                    {tel && <InputLeftAddon children='+36' />}
                    <Input {...register(name)} width={tel ? 340 : 400} maxLength={guard ? 13 : undefined}
                        placeholder={t(i18nPlaceHolder)} type={passwordConfirm ? 'password' : 'text'} onChangeCapture={(e) => {
                            setInput((e.target as HTMLInputElement).value)
                            if (guard) guardNumberHandler(e)
                        }} />
                    {password &&
                        <InputRightElement pr={1}>
                            <Button h='1.75rem' size='sm'>
                            </Button>
                        </InputRightElement>
                    }
                </InputGroup>
                {(isEmpty || isError) && <FormErrorMessage> {isEmpty ? 'A mező kitöltése kötelező.' : error} </FormErrorMessage>}
            </FormControl>
        </div>
    )
}

export default FormInput