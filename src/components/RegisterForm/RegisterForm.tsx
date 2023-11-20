import { Button, Divider, HStack, Heading, Input, InputGroup, InputLeftAddon, InputRightElement, Menu, MenuButton, MenuItem, MenuList, Stack, Text, useColorMode } from "@chakra-ui/react"
import { useState } from "react"
import { useTranslation } from "react-i18next"

export const RegisterForm = () => {

    const [show, setShow] = useState(false)
    const setPasswordVisibility = () => setShow(!show)

    const { i18n, t } = useTranslation()

    const isVisible = () => (show ? t('regForm-showPwd') : t('regForm-hidePwd'))

    const setMinWidth = (obj: string) => {
        if (i18n.language == 'hu' && obj == 'login') return 230
        if (i18n.language == 'en' && obj == 'login') return 190

        if (i18n.language == 'hu' && obj == 'personal') return 260
        if (i18n.language == 'en' && obj == 'personal') return 320
    }

    return (
        <form className="mx-auto container mt-3">
            <Heading marginBottom={10}>{t('register-header')}</Heading>
            <HStack marginBottom={5}>
                <Heading minWidth={setMinWidth('login')} size='lg'>{t('login-details')}</Heading>
                <Divider />
            </HStack>
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
            <HStack marginBottom={5}>
                <Heading minWidth={setMinWidth('personal')} size='lg'>{t('regForm-persInfo')}</Heading>
                <Divider />
            </HStack>
            <Stack marginBottom={5}>
                <div className="mb-3">
                    <Text>{t('regForm-fullname')}</Text>
                    <Input width={400} placeholder={t('regForm-usernamePholder')} />
                </div>
                <div className="mb-3">
                    <Text>{t('regForm-address')}</Text>
                    <Input width={400} placeholder={t('regForm-usernamePholder')} />
                </div>
                <div className="mb-3">
                    <Text>{t('regForm-idNumber')}</Text>
                    <Input width={400} placeholder={t('regForm-usernamePholder')} />
                </div>
                <div className="mb-3">
                    <Text>{t('regForm-email')}</Text>
                    <Input width={400} placeholder={t('regForm-usernamePholder')} />
                </div>
                <div className="mb-3">
                    <Text>{t('regForm-phone')}</Text>
                    <InputGroup>
                        <InputLeftAddon children='+36' />
                        <Input width={340} type='tel' placeholder='tel. szám' />
                    </InputGroup>
                </div>
            </Stack>


        </form>
    )
}