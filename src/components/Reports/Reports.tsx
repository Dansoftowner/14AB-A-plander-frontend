import { useEffect, useState } from 'react'
import CalendarComponent from '../Assignments/CalendarComponent'
import { Navigate } from 'react-router-dom'
import { Box, HStack, useColorModeValue, Text, ScaleFade } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

const Reports = () => {

    const reportBg = useColorModeValue('#3bb143', '#0b6623')
    const eventBg = useColorModeValue('#e4cd05', '#ed7014')
    const { t } = useTranslation('assignments')

    const [valid, setValid] = useState(true)
    useEffect(() => {
        if (localStorage.getItem('token') == null && sessionStorage.getItem('token') == null) setValid(false)
    }, [])

    if (!valid) return <Navigate to='/login' />


    return (
        <ScaleFade in>
            <CalendarComponent />
            <HStack>
                <Box borderRadius='50%' backgroundColor={eventBg} height={4} w={4} ml={5} />
                <Text m={0} fontWeight='bold'>{t('missingReport')}</Text>
                <Box borderRadius='50%' backgroundColor={reportBg} height={4} w={4} ml={5} />
                <Text m={0} fontWeight='bold'>{t('doneReport')}</Text>
            </HStack>
        </ScaleFade>
    )
}

export default Reports