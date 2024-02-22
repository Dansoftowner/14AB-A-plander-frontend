import { HStack, Icon, Text, VStack, useColorModeValue } from '@chakra-ui/react'
import { useAuth } from '../../hooks/hooks'
import { ChatMessage } from '../../services/socket'
import { useNavigate } from 'react-router-dom'
import i18n from '../../i18n'
import { GrUserPolice } from "react-icons/gr";

interface Props {
    message: ChatMessage
}

const Message = ({ message }: Props) => {

    const buttonBg = useColorModeValue('#0078d7', '#fde74c')
    const activeBg = useColorModeValue('#f5f5f5', 'gray.700')
    const { user } = useAuth()
    const isMe = user._id == message.sender?._id

    const navigate = useNavigate()
    const detailNavigator = () => {
        navigate('/member/' + message.sender?._id, {
            state: { id: message.sender?._id }
        })
    }

    const handleDate = () => {
        const locale = i18n.language == 'hu' ? `hu-HU` : `en-US`
        const date = new Date(message?.timestamp)
        const thisYear = date.getFullYear() == new Date().getFullYear()
        const todayDisplay = date.getHours() + ':' + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes()

        if (date.getDate() == new Date().getDate() && thisYear)
            return (date.getHours() < 10 ? '0' : '') + todayDisplay
        if (date.getMonth() == new Date().getMonth() && thisYear) {
            return `${date.toLocaleDateString(locale, { weekday: 'short', month: 'short', day: 'numeric' })}`
        }
        return date.toLocaleDateString(locale, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })

    }

    return (
        <VStack mt={2}>
            <HStack mr={!isMe ? 'auto' : 2} ml={!isMe ? '' : 'auto'}>
                {!isMe && <Icon m={0} p={0} as={GrUserPolice} />}
                <Text textAlign={isMe ? 'end' : 'start'} color={isMe ? buttonBg : ''} m={0} minW={100} onClick={detailNavigator} _hover={{ cursor: 'pointer' }}><b>{message.sender?.name}</b></Text>
                {isMe && <Icon m={0} p={0} as={GrUserPolice} color={buttonBg} />}
            </HStack>
            <HStack mr={!isMe ? 'auto' : 4} ml={!isMe ? 4 : 'auto'} >
                <Text bg={activeBg} padding={1.5} borderRadius={10} textAlign='start' m={0} maxW={{ base: '70vw', lg: '75vw' }}>{message.content}</Text>
            </HStack>
            <Text mr={!isMe ? 'auto' : 4} ml={!isMe ? 4 : 'auto'} textAlign={isMe ? 'end' : 'start'} my={0} fontStyle='italic'>{handleDate()}</Text>

        </VStack >
    )
}

export default Message