
import { useAssociations, Association } from '../../hooks/useAssociations'
import { ChangeEvent, Fragment, useMemo, useState } from 'react'
import { Box, Button, Checkbox, HStack, InputGroup, InputLeftElement, InputRightElement, Stack, Text, useColorModeValue, Image, FormErrorMessage, useToast, Spinner, Center, useColorMode, background } from '@chakra-ui/react'
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
import { Login, useLogin } from '../../hooks/useLogin.ts'
import { useNavigate } from 'react-router'
import useAuth from '../../hooks/useAuth.ts'
import { Link } from 'react-router-dom'
import NavBar from '../NavBar/NavBar.tsx'



const LoginPage = () => {
    const cardBackground = useColorModeValue('#89D0DF', '#3393DF')
    const dropDownFont = useColorModeValue('#808080', '#ffffff')
    const buttonBg = useColorModeValue('#0078d7', '#fde74c')
    const buttonColor = useColorModeValue('#ffffff', '#004881')
    const textColor = useColorModeValue('#0078D7', '#004881')
    const buttonHover = useColorModeValue('#0078b0', '#fde7af')

    const { colorMode } = useColorMode()

    const { t } = useTranslation('login')
    const inputSchema = useMemo(() => loginSchema(t), [t])

    type LoginForm = z.infer<typeof inputSchema>

    const { register, formState: { errors } } = useForm<LoginForm>({ resolver: zodResolver(inputSchema) })

    const [qParam, setQParam] = useState('')
    const { data: associations, fetchNextPage, isFetchingNextPage, isLoading, hasNextPage, } = useAssociations({ limit: 4, projection: 'lite', q: qParam })

    // const { setAuthToken, setUser, user } = useContext(AuthContext)

    const [selectedAssociation, setSelectedAssociation] = useState<Association | null>()
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [isChecked, setIsChecked] = useState<boolean>(false)

    const User: Login = {
        user: username,
        password: password,
        associationId: selectedAssociation?._id,
    }

    const navigate = useNavigate()
    const errorToast = useToast()

    const [user, setUser] = useState(JSON.parse(sessionStorage.getItem('user')!) || JSON.parse(localStorage.getItem('user')!))

    return (
        <>
            <NavBar />
            <Center display='flex' justifyContent='center' alignItems='center' h='90vh'>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    if (User.user && User.password && User.associationId) {
                        const remember = isChecked ? localStorage : sessionStorage
                        useLogin(User, remember).then(res => {
                            if (res == true) {
                                setUser(JSON.parse(remember.getItem('user')!))
                                navigate('/')
                            }
                            else {
                                errorToast({
                                    title: res.response.data.message,
                                    description: t('loginError'),
                                    status: 'error',
                                    duration: 9000,
                                    isClosable: true,
                                    position: 'top'
                                })
                            }
                        })
                    } else {
                        errorToast({
                            title: t('fieldMissing'),
                            description: t('loginError'),
                            status: 'error',
                            duration: 9000,
                            isClosable: true,
                            position: 'top'
                        })
                    }
                }}>
                    <Box
                        borderRadius="xl"
                        bg={cardBackground}
                        color="white"
                        maxW='100vw'
                        h={600}

                    >

                        <HStack alignContent='center' justifyContent='center'>
                            <Image my={10} src={colorMode == 'light' ? '/assets/logos/light-logo.svg' : '/assets/logos/dark-logo.svg'} width={100} />
                            <Text
                                mb={0}
                                color={textColor}
                                fontSize="xxx-large"
                                fontWeight="md"
                                className='font-face-mo'
                                fontFamily='Moul'
                            > Plander</Text>
                        </HStack>

                        <Stack alignItems='center' >
                            <Box width={400} maxW='90vw' margin={5}>
                                <AutoComplete freeSolo openOnFocus onChange={(_e: any, val: any) => setSelectedAssociation(val.originalValue)} isLoading={isLoading} emptyState={<Text textAlign='center' color={dropDownFont}>Nincs ilyen egyesület!</Text>}>
                                    <InputGroup>
                                        <AutoCompleteInput autoComplete="off" placeholder={t('associationSelector')}
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
                                    <AutoCompleteList loadingState={<Spinner />}>
                                        {associations?.pages.map((page, index) =>
                                            <Fragment key={index} >
                                                {page.items.map(association => (
                                                    <AutoCompleteItem
                                                        key={association._id}
                                                        value={association}
                                                        label={association.name}
                                                        textTransform="capitalize"
                                                        color={dropDownFont}
                                                    >
                                                        {association.name || 'nem jo gec'}
                                                    </AutoCompleteItem>
                                                ))}
                                            </Fragment>)}
                                        {hasNextPage &&
                                            <Button color={dropDownFont} onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                                                {isFetchingNextPage ? <Spinner /> : '...'}
                                            </Button>}
                                    </AutoCompleteList>
                                </AutoComplete>
                            </Box>

                            <Box margin={5}>
                                <FormInput _onChange={(e) => setUsername(e.target.value)} login register={register} name="username" errors={errors} required={false} i18nPlaceHolder="username" />
                            </Box>
                            <Box >
                                <PasswordInput _onChange={(e) => setPassword(e.target.value)} login register={register} name="password" errors={errors} required={false} i18nPlaceHolder="password" i18nTitle="" />
                            </Box>
                            <Checkbox margin={2} colorScheme='' {...register("autoLogin")} onChange={(e: ChangeEvent<HTMLInputElement>) => setIsChecked(e.target.checked)}>{t('stayInCheckbox')}</Checkbox>
                            {errors.autoLogin && <FormErrorMessage> {errors.autoLogin.message} </FormErrorMessage>}
                            <Link to='/forgotten-password'><Text fontStyle='italic' h={3} _hover={{ color: buttonBg, fontSize: 17, transition: '0.3s ease-in-out' }}>{t('forgotMyPassword')}</Text></Link>

                            <Button w={400} maxW='85vw' mt={10} backgroundColor={buttonBg} color={buttonColor} type='submit' _hover={{ backgroundColor: buttonHover }}>{t('loginButton')}</Button>
                        </Stack>
                    </Box >
                </form >
            </Center >
        </>
    )
}

export default LoginPage
