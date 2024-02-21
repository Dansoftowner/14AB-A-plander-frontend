import { Button, HStack, Heading, Stack, Image, useColorMode, useColorModeValue } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'


interface Props {
    status?: number,
    message: string
}

const ErrorPage = ({ status, message }: Props) => {
    const buttonBg = useColorModeValue('#0078d7', '#fde74c')
    const buttonColor = useColorModeValue('#ffffff', '#004881')
    const buttonHover = useColorModeValue('#0078b0', '#fde7af')


    const { colorMode } = useColorMode()
    const { t } = useTranslation()

    return (
        <Stack maxW='95vw' m={5} fontSize={20} align='center' mt={20}>
            <Image my={10} src={colorMode == 'light' ? '/assets/logos/light-logo.svg' : '/assets/logos/dark-logo.svg'} width={100} />

            <HStack>
                <Heading textAlign='center' color='red' fontSize='xxx-large' as='h1'>{status} - {t(message)}</Heading>
            </HStack>
            <Button my={5} backgroundColor={buttonBg} color={buttonColor} _hover={{ backgroundColor: buttonHover }}>
                <Link to='/'>{t('backToHome')}</Link>
            </Button>
        </Stack>
    )
}

export default ErrorPage