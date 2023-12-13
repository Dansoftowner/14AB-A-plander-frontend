import useAssociations, { Association } from '../../hooks/useAssociations'
import { Fragment, useMemo, useState } from 'react'
import { Box, Button, Checkbox, Flex, HStack, Image, InputGroup, InputLeftElement, InputRightElement, Stack, Text, useColorMode, useColorModeValue } from '@chakra-ui/react'
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
import './LoginPage.css';



const LoginPage = () => {
    const cardBackground = useColorModeValue('#89D0DF', '#3393DF')
    const dropDownFont = useColorModeValue('#808080', '#ffffff')
    const buttonBg = useColorModeValue('#0078d7', '#fde74c')
    const buttonColor = useColorModeValue('#ffffff', '#004881')
    const textColor = useColorModeValue('#0078D7', '#004881')

    const { colorMode } = useColorMode()

    const { t } = useTranslation()
    const inputSchema = useMemo(() => loginSchema(t), [t])

    type LoginForm = z.infer<typeof inputSchema>

    const { register, formState: { errors } } = useForm<LoginForm>({ resolver: zodResolver(inputSchema) })

    const associations = useAssociations({ limit: 10, projection: 'full' }).data
    const [selectedAssociation, setSelectedAssociation] =
        useState<Association | null>()
    console.log(selectedAssociation);


    return (
        <Box alignItems='center' justifyContent='center' h={100} margin='auto' >
            <Box
                mt={120}
                className="mx-auto container"
                borderRadius="xl"
                bg={cardBackground}
                color="white"
                h={600}
                w={500}
            >
                <HStack alignContent='center' justifyContent='center'>
                    <Image my={10} src={colorMode == 'light' ? '/assets/logos/light-logo.svg' : '/assets/logos/dark-logo.svg'} width={100} />
                    <Text
                        mb={0}
                        color={textColor}
                        fontSize="xxx-large"
                        fontWeight="md"
                        className='font-face-mo'
                    > Plander</Text>
                </HStack>

                <Stack alignItems='center' >
                    <Box width={400} margin={5}>
                        <AutoComplete openOnFocus onChange={(_e: any, val: any) => setSelectedAssociation(val.originalValue)}>
                            <InputGroup>
                                <AutoCompleteInput autoComplete="off" placeholder={t('loginPage-association')}
                                    {...register("username")}
                                    borderRadius={10}
                                    fontSize={20}
                                    h={10}
                                />
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
                                        color={dropDownFont}
                                    >
                                        {association.name}
                                    </AutoCompleteItem>
                                ))}
                            </AutoCompleteList>
                        </AutoComplete>
                    </Box>

                    <Box margin={5}>
                        <FormInput login register={register} name="username" errors={errors} required={false} i18nPlaceHolder="loginPage-userName" />
                    </Box>
                    <Box >
                        <PasswordInput login register={register} name="password" errors={errors} required={false} i18nPlaceHolder="loginPage-password" i18nTitle="" />
                    </Box>
                    <Checkbox margin={2} colorScheme='' >{t('loginPage-stayInCheckbox')}</Checkbox>

                    <Button w={400} mt={10} backgroundColor={buttonBg} color={buttonColor}>{t('loginPage-loginButton')}</Button>
                </Stack>



                <Text>{selectedAssociation?.name}</Text>
                <Text>{selectedAssociation?.location}</Text>
                <Text>{selectedAssociation?._id}</Text>
                <Text>{selectedAssociation?.certificate}</Text>
            </ Box>
        </Box >
    )
}

export default LoginPage
