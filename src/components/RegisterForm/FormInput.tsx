import { FormControl, FormLabel, Input, FormErrorMessage, InputGroup, InputLeftAddon } from '@chakra-ui/react'
import { t } from 'i18next'
import { ChangeEvent, useMemo, useState } from 'react'
import { FieldErrors, FieldValues, Path, UseFormRegister, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { schema } from "./inputSchema"

interface Props<FormData extends FieldValues> {
    required: boolean,
    i18nTitle: string,
    i18nPlaceHolder: string,
    name: Path<FormData>
    register: UseFormRegister<FormData>,
    errors: FieldErrors
    tel?: boolean
    guardChange?: void
}

const FormInput = <FormData extends FieldValues>({ register, guardChange, tel, errors, name, required, i18nTitle, i18nPlaceHolder }: Props<FormData>) => {
    const inputSchema = useMemo(() => schema(t), [t])
    type RegForm = z.infer<typeof inputSchema>
    const { formState: { } } = useForm<RegForm>({ resolver: zodResolver(inputSchema) })


    const [input, setInput] = useState('')
    const error = errors?.[name]?.message as string | undefined
    const isEmpty = input === ''
    const isError = error != undefined

    const lengths: number[] = [2, 7]
    let prevValue = 0
    const guardNumberHandler = (e: ChangeEvent<HTMLInputElement>) => {
        if (lengths.includes(e.target.value.length) && (prevValue != 2 && prevValue != 7)) e.target.value += '/'
        if (e.target.value.length >= 1) prevValue = e.target.value.length - 1
    }

    return (
        <div className="mb-3">
            <FormControl isRequired={required} isInvalid={isError || isEmpty}>
                <FormLabel>{t(i18nTitle)}</FormLabel>
                <InputGroup>
                    {tel && <InputLeftAddon children='+36' />}
                    <Input {...register(name)} width={tel ? 340 : 400} placeholder={t(i18nPlaceHolder)} onChangeCapture={(e) => { setInput((e.target as HTMLInputElement).value) }} />
                </InputGroup>
                {(isEmpty || isError) && <FormErrorMessage> {isEmpty ? 'aad meg.' : error} </FormErrorMessage>}
            </FormControl>
        </div>
    )
}

export default FormInput