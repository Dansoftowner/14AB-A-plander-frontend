import { FormControl, FormLabel, Input, FormErrorMessage, InputGroup, InputRightElement, Button, InputLeftElement, useColorMode } from '@chakra-ui/react'
import { t } from 'i18next'
import { useMemo, useState } from 'react'
import { FieldErrors, FieldValues, Path, UseFormRegister, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { regSchema } from "./inputSchema"
import { IoMdEyeOff, IoMdEye } from 'react-icons/io'
import { MdLockOutline } from "react-icons/md";
import { useTranslation } from 'react-i18next'


interface Props<FormData extends FieldValues> {
    required: boolean,
    i18nTitle?: string,
    i18nPlaceHolder: string,
    name: Path<FormData>
    register: UseFormRegister<FormData>,
    errors: FieldErrors
    login?: boolean,
    _onChange?: (e: any) => void,
    bColor?: string
}

const PasswordInput = <FormData extends FieldValues>({ login, bColor, register, errors, name, required, i18nTitle, i18nPlaceHolder, _onChange }: Props<FormData>) => {
    const { t } = useTranslation('register')
    const { colorMode } = useColorMode()

    const inputSchema = useMemo(() => regSchema(t), [t])
    type RegForm = z.infer<typeof inputSchema>
    const { formState: { } } = useForm<RegForm>({ resolver: zodResolver(inputSchema) })


    const error = errors?.[name]?.message as string | undefined
    const isError = error != undefined

    const [show, setShow] = useState(false)
    const isVisible = () => (show ? <IoMdEyeOff /> : <IoMdEye />)

    if (login) {
        return (
            <FormControl isRequired={required} isInvalid={isError} width={400} maxW='90vw'>
                {i18nTitle && <FormLabel>{t(i18nTitle)}</FormLabel>}
                <InputGroup>
                    <InputLeftElement>
                        <MdLockOutline />
                    </InputLeftElement>
                    <Input
                        {...register(name, { required })}
                        onChange={_onChange}
                        placeholder={t(i18nPlaceHolder)}
                        type={show ? 'text' : 'password'}
                        name={name}
                        borderRadius={10}
                        fontSize={20}
                        h={10}
                        boxShadow='md'
                        _hover={bColor ? { borderColor: bColor } : {}}
                        borderColor={bColor}
                        backgroundColor={bColor}
                        _placeholder={{ color: colorMode === 'light' ? 'gray.300' : 'gray.500' }}

                    />
                    <InputRightElement width="4.5rem">
                        <Button backgroundColor='transparent' h='1.75rem' size='sm' onClick={() => setShow(!show)}>
                            {isVisible()}
                        </Button>
                    </InputRightElement>
                </InputGroup>
                {(isError) && <FormErrorMessage> {error} </FormErrorMessage>}
            </FormControl>
        )
    }

    return (
        <div className="mb-3">
            <FormControl isRequired={required} isInvalid={isError}>
                {i18nTitle && <FormLabel>{t(i18nTitle)}</FormLabel>}
                <InputGroup>
                    <Input {...register(name)} width={400} type={show ? 'text' : 'password'}
                        placeholder={t(i18nPlaceHolder)} />
                    <InputRightElement pr={1}>
                        <Button h='1.75rem' size='sm' onClick={() => setShow(!show)}>
                            {isVisible()}
                        </Button>
                    </InputRightElement>

                </InputGroup>
                {(isError) && <FormErrorMessage> {error} </FormErrorMessage>}
            </FormControl>
        </div>
    )
}

export default PasswordInput