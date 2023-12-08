import useAssociations, { Association } from '../../hooks/useAssociations'
import { useMemo, useState } from 'react'
import { Box, Checkbox, Icon, InputGroup, InputLeftAddon, InputLeftElement, InputRightElement, Menu, Stack, Text, useColorModeValue } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { loginSchema } from '../RegisterForm/inputSchema'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import PasswordInput from '../RegisterForm/PasswordInput'
import FormInput from '../RegisterForm/FormInput'
import {
    AutoComplete,
    AutoCompleteInput,
    AutoCompleteItem,
    AutoCompleteList,
} from "@choc-ui/chakra-autocomplete";
import { FaChevronDown } from "react-icons/fa";
import { MdOutlineLocalPolice } from "react-icons/md";



const LoginPage = () => {
    const cardBackground = useColorModeValue('#89D0DF', '#3393DF')
    const textColor = useColorModeValue('#0078D7', '#004881')

    const { t } = useTranslation()
    const inputSchema = useMemo(() => loginSchema(t), [t])

    type LoginForm = z.infer<typeof inputSchema>

    const { register, formState: { errors } } = useForm<LoginForm>({ resolver: zodResolver(inputSchema) })

    const associations = useAssociations({ limit: 10, projection: 'full' }).data
    const [selectedAssociation, setSelectedAssociation] =
        useState<Association | null>()
    console.log(selectedAssociation);


    return (
        <>
            <Box
                className="mx-auto container mt-3"
                borderRadius="xl"
                bg={cardBackground}
                color="white"
                h={600}
                w={500}
                alignItems='center'
            >
                <Text
                    color={textColor}
                    fontSize="x-large"
                    fontFamily="Moul"
                    fontWeight="md"
                > Plander</Text>





                <Stack mt={10} alignItems='center' >
                    <Box width={400} margin={5}>
                        <AutoComplete openOnFocus onChange={(e: any, val: any) => setSelectedAssociation(val.originalValue)}>
                            <InputGroup>
                                <AutoCompleteInput autoComplete="off" placeholder="Válasszon egyesületet!"
                                    {...register("username")}
                                    borderRadius={10}
                                    fontSize={20}
                                    h={10} />
                                <InputRightElement
                                    children={<FaChevronDown />} />
                                <InputLeftElement>
                                    <MdOutlineLocalPolice />
                                </InputLeftElement>
                            </InputGroup>
                            <AutoCompleteList>
                                {associations.map((association, id) => (
                                    <AutoCompleteItem
                                        key={id}
                                        value={association}
                                        label={association.name}
                                        textTransform="capitalize"
                                    >
                                        {association.name}
                                    </AutoCompleteItem>
                                ))}
                            </AutoCompleteList>
                        </AutoComplete>
                    </Box>

                    <Box margin={5}>
                        <FormInput login register={register} name="username" errors={errors} required={false} i18nPlaceHolder="Felhasználónév" />
                    </Box>
                    <Box margin={5}>
                        <PasswordInput login register={register} name="password" errors={errors} required={false} i18nPlaceHolder="regForm-pwdPholder" i18nTitle="" />
                    </Box>
                    <Checkbox>Maradjak bejelentkezve</Checkbox>
                </Stack>


                <Text>{selectedAssociation?.name}</Text>
                <Text>{selectedAssociation?.location}</Text>
                <Text>{selectedAssociation?._id}</Text>
                <Text>{selectedAssociation?.certificate}</Text>
            </Box >
        </>
    )
}

export default LoginPage
