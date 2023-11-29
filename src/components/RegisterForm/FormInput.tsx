import { FormControl, FormLabel, Input, FormErrorMessage } from '@chakra-ui/react'
import { t } from 'i18next'
import React, { useMemo, useState } from 'react'
import { schema } from './inputSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { FieldError, FieldValues, useForm } from 'react-hook-form'
import { z } from 'zod'

interface Props<FormData extends FieldValues> {
    required: boolean,
    i18nTitle: string,
    i18nPlaceHolder: string,
    fieldName: "username" | "password" | "repeatedPassword" | "fullName" | "address" | "idNumber" | "guardNumber" | "emailAddress" | "phoneNumber"
    fieldError?: FieldError | undefined
}

const FormInput = <FormData extends FieldValues>({ required, i18nTitle, i18nPlaceHolder, fieldName, fieldError }: Props<FormData>) => {
    const inputSchema = useMemo(() => schema(t), [t])
    type RegForm = z.infer<typeof inputSchema>
    const { register, formState: { errors } } = useForm<RegForm>({ resolver: zodResolver(inputSchema) })


    const [input, setInput] = useState('')
    const isError = input === ''

    const error: FieldError | undefined = errors?.[fieldName] as FieldError | undefined

    console.log(error);


    return (
        <div className="mb-3">
            <FormControl isRequired={required} isInvalid={isError}>
                <FormLabel>{t(i18nTitle)}</FormLabel>
                <Input {...register(fieldName)} width={400} placeholder={t(i18nPlaceHolder)} onChange={(e) => setInput(e.target.value)} />
                {isError && <FormErrorMessage> Add meg pls. </FormErrorMessage>}
                {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
            </FormControl>
        </div>
    )
}

//regForm-email , 
//'"username" | "password" | "repeatedPassword" | "fullName" | "address" | "idNumber" | "guardNumber" | "emailAddress" | "phoneNumber"'

export default FormInput