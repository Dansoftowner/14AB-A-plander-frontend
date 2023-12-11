
import { useAssociations, Association } from '../../hooks/useAssociations'
import { ChangeEvent, Fragment, useContext, useMemo, useReducer, useState } from 'react'
import { Box, Button, Checkbox, HStack, InputGroup, InputLeftElement, InputRightElement, Stack, Text, useColorModeValue, Image, FormControl, FormErrorMessage } from '@chakra-ui/react'
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
import { Login, useLogin, useLoginForMe } from '../../hooks/useLogin.ts'
import { useNavigate } from 'react-router'
import { AuthContext } from '../../context/authContext.ts'



const LoginPage = () => {
    const cardBackground = useColorModeValue('#89D0DF', '#3393DF')
    const dropDownFont = useColorModeValue('#808080', '#ffffff')
    const buttonBg = useColorModeValue('#0078d7', '#fde74c')
    const buttonColor = useColorModeValue('#ffffff', '#004881')
    const textColor = useColorModeValue('#0078D7', '#004881')

    const { t } = useTranslation()
    const inputSchema = useMemo(() => loginSchema(t), [t])

    type LoginForm = z.infer<typeof inputSchema>

    const { register, formState: { errors } } = useForm<LoginForm>({ resolver: zodResolver(inputSchema) })

    const [qParam, setQParam] = useState('')
    const { data: associations, fetchNextPage, isFetchingNextPage } = useAssociations({ limit: 4, projection: 'lite', q: qParam })


    const [selectedAssociation, setSelectedAssociation] = useState<Association | null>()
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [isChecked, setIsChecked] = useState<boolean>(false)

    const User: Login = {
        user: username,
        password: password,
        associationId: selectedAssociation?._id,
        isAutoLogin: isChecked
    }

    const navigate = useNavigate()
    const authContext = useContext(AuthContext)

    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            if (User.user && User.password && User.associationId) {
                useLogin(User).then(res => {
                    console.log(res)
                    authContext.dispatch({ type: 'SET_TOKEN', isLoggedIn: res })
                    // console.log(authContext.token)
                    if (res) navigate('/')
                })
            }
        }}>
            <Box
                className="mx-auto container mt-3"
                borderRadius="xl"
                bg={cardBackground}
                color="white"
                h={600}
                w={500}
                alignItems='center'
            >
                <HStack>
                    <Image src='./assets/logo.png' width={100} />
                    <Text
                        color={textColor}
                        fontSize="xxx-large"
                        fontWeight="md"
                        className='font-face-mo'
                        marginLeft={10}
                    > Plander</Text>
                </HStack>

                <Stack mt={10} alignItems='center' >
                    <Box width={400} margin={5}>
                        <AutoComplete openOnFocus onChange={(_e: any, val: any) => setSelectedAssociation(val.originalValue)}>
                            <InputGroup>
                                <AutoCompleteInput autoComplete="off"
                                    placeholder="Válasszon egyesületet!"
                                    borderRadius={10}
                                    fontSize={20}
                                    h={10}
                                    onChange={(val: any) => {
                                        setQParam(val.target.value)
                                    }}
                                />
                                <InputRightElement
                                    children={<FaChevronDown />} />
                                <InputLeftElement>
                                    <MdOutlineLocalPolice />
                                </InputLeftElement>
                                {errors.association && <FormErrorMessage> {errors.association.message} </FormErrorMessage>}
                            </InputGroup>
                            <AutoCompleteList>
                                {associations?.pages.map((page, index) =>
                                    <Fragment key={index}>
                                        {page.items.map(association => (
                                            <AutoCompleteItem
                                                key={association._id}
                                                value={association}
                                                label={association.name}
                                                textTransform="capitalize"
                                                color={dropDownFont}
                                            >
                                                {association.name}
                                            </AutoCompleteItem>
                                        ))}
                                    </Fragment>)}
                                {associations?.pages &&
                                    <Button color='red' onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                                        {isFetchingNextPage ? 'Loading...' : 'More...'}
                                    </Button>}
                            </AutoCompleteList>
                        </AutoComplete>
                    </Box>

                    <Box margin={5}>
                        <FormInput _onChange={(e) => setUsername(e.target.value)} login register={register} name="username" errors={errors} required={false} i18nPlaceHolder="Felhasználónév" />
                    </Box>
                    <Box >
                        <PasswordInput _onChange={(e) => setPassword(e.target.value)} login register={register} name="password" errors={errors} required={false} i18nPlaceHolder="regForm-pwdPholder" i18nTitle="" />
                    </Box>
                    <Checkbox margin={2} colorScheme='' {...register("autoLogin")} onChange={(e: ChangeEvent<HTMLInputElement>) => setIsChecked(e.target.checked)}>Maradjak bejelentkezve</Checkbox>
                    {errors.autoLogin && <FormErrorMessage> {errors.autoLogin.message} </FormErrorMessage>}

                    <Button w={400} mt={10} backgroundColor={buttonBg} color={buttonColor} type='submit'>Bejelentkezés</Button>
                </Stack>



                <Text>{selectedAssociation?.name}</Text>
                <Text>{selectedAssociation?.location}</Text>
                <Text>{selectedAssociation?._id}</Text>
                <Text>{selectedAssociation?.certificate}</Text>
            </Box >
        </form >
    )
}

export default LoginPage
