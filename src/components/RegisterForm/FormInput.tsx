import { FormControl, FormLabel, Input, FormErrorMessage } from '@chakra-ui/react'
import { t } from 'i18next'
import { useMemo, useState } from 'react'
import { FieldError, FieldErrors, FieldValues, Path, UseFormRegister, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { schema } from "./inputSchema"

interface Props<FormData extends FieldValues> {
    required: boolean,
    i18nTitle: string,
    i18nPlaceHolder: string,
    name: Path<FormData>
    fieldName: "username" | "password" | "repeatedPassword" | "fullName" | "address" | "idNumber" | "guardNumber" | "emailAddress" | "phoneNumber"
    registerField: UseFormRegister<FormData>,
    errors2: FieldErrors<FormData>
}

const FormInput = <FormData extends FieldValues>({ registerField, name, required, i18nTitle, i18nPlaceHolder,errors2, fieldName }: Props<FormData>) => {
     const inputSchema = useMemo(() => schema(t), [t])
      type RegForm = z.infer<typeof inputSchema>
      const {register, formState: {errors} } = useForm<RegForm>({ resolver: zodResolver(inputSchema) })


    const [input, setInput] = useState('')
    const isError = input === ''
    // const error = errors2?.[fieldName]?.message as string | undefined

    console.log(errors2?.[name]);

    return (
        <div className="mb-3">
            <FormControl isRequired={required} isInvalid={isError}>
                <FormLabel>{t(i18nTitle)}</FormLabel>
                <Input {...register(fieldName)} width={400} placeholder={t(i18nPlaceHolder)} onChange={(e) => setInput(e.target.value)} />
                {isError && <FormErrorMessage> Add meg pls. </FormErrorMessage>}
                {errors.emailAddress && <FormErrorMessage>{errors.emailAddress.message}</FormErrorMessage>}
            </FormControl>
        </div>
    )
}

//regForm-email , 
//'"username" | "password" | "repeatedPassword" | "fullName" | "address" | "idNumber" | "guardNumber" | "emailAddress" | "phoneNumber"'

export default FormInput