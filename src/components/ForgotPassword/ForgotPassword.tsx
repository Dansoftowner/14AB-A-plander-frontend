import { Box, Button, FormControl, FormErrorMessage, FormLabel, Heading, Input, InputGroup, InputLeftElement, InputRightElement, Spinner, Stack, Text, useColorModeValue, useToast } from '@chakra-ui/react'
import { AutoComplete, AutoCompleteInput, AutoCompleteList, AutoCompleteItem } from '@choc-ui/chakra-autocomplete'
import { Fragment, useMemo, useState } from 'react'
import { FaChevronDown } from 'react-icons/fa'
import { MdOutlineLocalPolice } from 'react-icons/md'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Association, useAssociations } from '../../hooks/useAssociations'
import { useTranslation } from 'react-i18next'
import { Form, useForm } from 'react-hook-form'
import { useNewPassword, useResetPassword } from '../../hooks/useResetPassword'
import { forgotPasswordSchema } from '../RegisterForm/inputSchema'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import apiClient from '../../services/apiClient'

const ForgotPassword = () => {

    const dropDownFont = useColorModeValue('#808080', '#ffffff')
    const buttonBg = useColorModeValue('#0078d7', '#fde74c')
    const buttonColor = useColorModeValue('#ffffff', '#004881')

    const { t } = useTranslation(['login', 'register'])
    const toast = useToast()
    const navigate = useNavigate()

    const { id, restorationToken } = useParams()
    if (id && restorationToken) {

        const inputSchema = useMemo(() => forgotPasswordSchema(t), [t])
        type ResetForm = z.infer<typeof inputSchema>
        const { register, handleSubmit, formState: { errors } } = useForm<ResetForm>({ resolver: zodResolver(inputSchema) })

        const isErrors = errors.password?.message || errors.repeatedPassword?.message

        return (
            <form onSubmit={handleSubmit(e => {
                type dataOmit = Omit<typeof e, "repeatedPassword">
                const post: dataOmit = { password: e.password }

                apiClient.post(`members/forgotten-password/${id}/${restorationToken}`, post).then(res => {
                    toast({
                        title: res.status === 204 ? t('login:success') : t('login:error'),
                        status: res.status === 204 ? 'success' : 'error',
                        duration: 9000,
                        isClosable: true,
                        position: 'top'
                    })
                    if (res.status === 204) navigate('/login')
                }).catch(err => {
                    toast({
                        title: err.response.status === 204 ? t('login:success') : t('login:error'),
                        description: err.response.data.message,
                        status: 'error',
                        duration: 9000,
                        isClosable: true,
                        position: 'top'
                    })
                })
            })}>
                <FormControl isInvalid={isErrors ? true : false}>
                    <Stack alignItems='center' justifyContent='center' display='flex' h='90vh'>
                        <Heading as='h1'>{t('enterNewPassword')}</Heading>
                        <Text maxW={650} textAlign='center' fontSize='larger'>{t('newPasswordRequirements')}</Text>
                        <Box w={400} m={5}>
                            <Input type='password' id='pwd' {...register('password', { required: true })} borderColor='#767676' placeholder={t('register:pwdPholder')} borderRadius={10} fontSize={20} h={10} />
                            {errors.password && <FormErrorMessage> {t('register:' + errors.password.message)} </FormErrorMessage>}
                        </Box>
                        <Box minH={20} w={400} m={5}>
                            <Input type='password' {...register('repeatedPassword', { required: true })} borderColor='#767676' placeholder={t('register:repeatPwd')} borderRadius={10} fontSize={20} h={10} />
                            {errors.repeatedPassword && <FormErrorMessage> {t('register:' + errors.repeatedPassword.message)} </FormErrorMessage>}
                        </Box>
                        <Button name="submitbtn" type="submit" backgroundColor={buttonBg} color={buttonColor}>{t('sendNewPWd')}</Button>
                        <Button margin={5} padding={5} backgroundColor={buttonBg} color={buttonColor}>
                            <Link to='/login'>{t('backToLogin')}</Link>
                        </Button>
                    </Stack>
                </FormControl>

            </form>
        )
    }


    const [selectedAssociation, setSelectedAssociation] = useState<Association | null>()
    const [email, setEmail] = useState<string>('')

    const [qParam, setQParam] = useState('')
    const { data: associations, fetchNextPage, isFetchingNextPage, isLoading, hasNextPage, } = useAssociations({ limit: 4, projection: 'lite', q: qParam })

    const submitHandler = (e: any) => {

        e.preventDefault()
        if (selectedAssociation && email) {
            useResetPassword(email, selectedAssociation._id).then(res => {
                if (res == true) {
                    toast({
                        title: t('emailSent'),
                        status: 'success',
                        duration: 9000,
                        isClosable: true,
                        position: 'top'
                    })
                }
            })
        } else {
            toast({
                title: t('fieldMissing'),
                status: 'error',
                duration: 9000,
                isClosable: true,
                position: 'top'
            })
        }
    }

    return (
        <form onSubmit={(e) => submitHandler(e)}>
            <Stack alignItems='center' justifyContent='center' display='flex' h='90vh'>
                <Heading as='h1'>{t('lostPassword')}</Heading>
                <Text maxW={650} textAlign='center' fontSize='larger'>{t('explainReset')}</Text>
                <Box width={400} margin={5}>
                    <FormLabel>{t('common:association')}</FormLabel>
                    <AutoComplete freeSolo openOnFocus onChange={(_e: any, val: any) => setSelectedAssociation(val.originalValue)} isLoading={isLoading} emptyState={<Text textAlign='center' color={dropDownFont}>Nincs ilyen egyesület!</Text>}>
                        <InputGroup>
                            <AutoCompleteInput borderColor='#767676' autoComplete="off" placeholder={t('associationSelector')}
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
                                            {association.name || 'itt se jo gec'}
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


                <Box margin={5} w={400} >
                    <FormLabel>{t('common:emailAddress')}</FormLabel>
                    <Input type='email' borderColor='#767676' placeholder={t('common:emailAddress')} onChangeCapture={(e) => setEmail((e.target as HTMLInputElement).value)} borderRadius={10} fontSize={20} h={10} />
                </Box>

                <Button type='submit' margin={5} padding={5} backgroundColor={buttonBg} color={buttonColor}>{t('newPassword')}</Button>
                <Button margin={5} padding={5} backgroundColor={buttonBg} color={buttonColor}>
                    <Link to='/login'>{t('backToLogin')}</Link>
                </Button>
            </Stack>
        </ form>
    )
}

export default ForgotPassword