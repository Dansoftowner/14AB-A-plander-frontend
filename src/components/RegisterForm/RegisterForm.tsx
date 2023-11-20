import { Button, HStack, Heading, Input, InputGroup, InputRightElement, Stack, Text } from "@chakra-ui/react"
import { useState } from "react"
import { useTranslation } from "react-i18next"

export const RegisterForm = () => {

    const [show, setShow] = useState(false)
    const setPasswordVisibility = () => setShow(!show)

    const { t } = useTranslation()

    const isVisible = () =>  (show ? t('regForm-showPwd') : t('regForm-hidePwd'))

    return (
        <form className="mx-auto container mt-3">
            <Heading marginBottom={10}>{t('register-header')}</Heading>
            <Heading size='lg'>{t('login-details')}</Heading>
            <hr />
            <Stack marginBottom={5}>
                <div className="mb-3">
                    <Text>{t('username')}</Text>
                    <Input width={400} placeholder={t('regForm-usernamePholder')} />
                </div>
                <Text>{t('password')}</Text>
                <HStack justify='start'>
                    <div className="mb-3">
                        <InputGroup size='md'>
                            <Input
                                pr='4.5rem'
                                type={show ? 'text' : 'password'}
                                placeholder={t('regForm-pwdPholder')} width={400}
                            />
                            <InputRightElement width='4.5rem'>
                                <Button h='1.75rem' size='sm' margin={1} onClick={setPasswordVisibility}>
                                    {isVisible()}
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                    </div>
                    <div className="mb-3">
                        <InputGroup size='md'>
                            <Input
                                pr='4.5rem'
                                type={"password"}
                                placeholder={t('regForm-repeatPwd')} width={400}
                            />
                        </InputGroup>
                    </div>
                </HStack>
            </Stack>
            <Heading size='lg'>{t('regForm-persInfo')}</Heading>
            <hr />


        </form>
    )
}