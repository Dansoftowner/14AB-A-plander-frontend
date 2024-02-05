import {
    FormControl, FormLabel, Input, FormErrorMessage, InputGroup, HStack, VStack, Menu, InputLeftElement,
} from '@chakra-ui/react'
import { useMemo } from 'react'
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
import { FaRegUser } from "react-icons/fa";
import { useTranslation } from 'react-i18next'
import { guardNumberHandler, telHandler } from './specInputHandler'


interface Props<FormData extends FieldValues> {
    required: boolean
    i18nTitle?: string
    i18nPlaceHolder: string
    name: Path<FormData>
    register: UseFormRegister<FormData>
    errors: FieldErrors
    telPrefix?: string
    guard?: boolean
    passwordConfirm?: boolean
    login?: boolean,
    _onChange?: (e: any) => void,
    value?: string
}

const FormInput = <FormData extends FieldValues>({
    register,
    guard,
    telPrefix,
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

    const error = errors?.[name]?.message as string | undefined
    const isError = error != undefined

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
                                width={telPrefix ? 240 : 400}
                                maxLength={
                                    guard ? 13 : telPrefix == "+36" ? 11 : 20
                                }
                                placeholder={t(i18nPlaceHolder)}
                                type={passwordConfirm ? 'password' : 'text'}
                                onChangeCapture={(e) => {
                                    if (guard) guardNumberHandler(e)
                                    if (telPrefix == '+36') telHandler(e)
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
