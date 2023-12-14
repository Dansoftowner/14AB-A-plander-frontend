import { Button, Heading, Stack, Text } from '@chakra-ui/react'
import React from 'react'
import { Link } from 'react-router-dom'

interface Props {
    status: number,
    message: string
}

const ErrorPage = ({ status, message }: Props) => {
    return (
        <Stack m={5} fontSize={20} align='center'>
            <Heading fontSize='xxx-large' as='h1'>{status}</Heading>
            <Heading>Sajnálatos hiba történt :( !</Heading>
            <Text>{message}</Text>
            <Button>
                <Link to='/'>Vissza a főoldalra...</Link>
            </Button>
        </Stack>
    )
}

export default ErrorPage