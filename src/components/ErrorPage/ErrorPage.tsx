import { Button, Heading, Stack, Text, useColorModeValue } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

interface Props {
    status: number,
    message: string
}

const ErrorPage = ({ status, message }: Props) => {
    const buttonBg = useColorModeValue('#0078d7', '#fde74c')
    const buttonColor = useColorModeValue('#ffffff', '#004881')
    const buttonHover = useColorModeValue('#0078b0', '#fde7af')


    const { t } = useTranslation()

    return (
        <Stack m={5} fontSize={20} align='center'>
            <Heading fontSize='xxx-large' as='h1'>{status}</Heading>
            <Heading>Sajnálatos hiba történt :( !</Heading>
            <Text>{message}</Text>
            <Button backgroundColor={buttonBg} color={buttonColor} _hover={{ backgroundColor: buttonHover }}>
                <Link to='/'>Vissza a főoldalra...</Link>
            </Button>
        </Stack>
    )
}

export default ErrorPage