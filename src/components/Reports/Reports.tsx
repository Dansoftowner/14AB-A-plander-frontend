import { useEffect, useState } from 'react'
import CalendarComponent from '../Assignments/CalendarComponent'
import { Navigate } from 'react-router-dom'
import { Box, HStack, useColorModeValue, Text } from '@chakra-ui/react'

const Reports = () => {

    const reportBg = useColorModeValue('#3bb143', '#0b6623')
    const eventBg = useColorModeValue('#e4cd05', '#ed7014')

    const [valid, setValid] = useState(true)
    useEffect(() => {
        if (localStorage.getItem('token') == null && sessionStorage.getItem('token') == null) setValid(false)
    }, [])

    if (!valid) return <Navigate to='/login' />


    return (
        <>
            <CalendarComponent />
            <HStack>
                <Box borderRadius='50%' backgroundColor={eventBg} height={4} w={4} ml={5} />
                <Text m={0} fontWeight='bold'>Hiányzó jelentés</Text>
                <Box borderRadius='50%' backgroundColor={reportBg} height={4} w={4} ml={5} />
                <Text m={0} fontWeight='bold'>Elkészített jelentés</Text>
            </HStack>
        </>
    )
}

export default Reports