import { FormControl, FormLabel, Input, FormErrorMessage, InputGroup, InputRightElement, Button } from '@chakra-ui/react'
import { t } from 'i18next'
import { useMemo, useState } from 'react'
import { FieldErrors, FieldValues, Path, UseFormRegister, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { schema } from "./inputSchema"
import { IoMdEyeOff, IoMdEye } from 'react-icons/io'

interface Props<FormData extends FieldValues> {
    required: boolean,
    i18nTitle?: string,
    i18nPlaceHolder: string,
    name: Path<FormData>
    register: UseFormRegister<FormData>,
    errors: FieldErrors
}

const PasswordInput = <FormData extends FieldValues>({ register, errors, name, required, i18nTitle, i18nPlaceHolder }: Props<FormData>) => {
    const inputSchema = useMemo(() => schema(t), [t])
    type RegForm = z.infer<typeof inputSchema>
    const { formState: { } } = useForm<RegForm>({ resolver: zodResolver(inputSchema) })


    const [input, setInput] = useState('')
    const error = errors?.[name]?.message as string | undefined
    const isEmpty = input === ''
    const isError = error != undefined

    const [show, setShow] = useState(false)
    const isVisible = () => (show ? <IoMdEyeOff /> : <IoMdEye />)

    return (
        <div className="mb-3">
            <FormControl isRequired={required} isInvalid={isError || isEmpty}>
                {i18nTitle && <FormLabel>{t(i18nTitle)}</FormLabel>}
                <InputGroup>
                    <Input {...register(name)} width={400} type={show ? 'text' : 'password'}
                        placeholder={t(i18nPlaceHolder)} onChangeCapture={(e) => setInput((e.target as HTMLInputElement).value)} />
                    <InputRightElement pr={1}>
                        <Button h='1.75rem' size='sm' onClick={() => setShow(!show)}>
                            {isVisible()}
                        </Button>
                    </InputRightElement>

                </InputGroup>
                {(isEmpty || isError) && <FormErrorMessage> {isEmpty ? 'aad meg.' : error} </FormErrorMessage>}
            </FormControl>
        </div>
    )
}

export default PasswordInput