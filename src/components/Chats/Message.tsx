import { Box, HStack, Text, useColorModeValue } from '@chakra-ui/react'
import { useAuth } from '../../hooks/hooks'
import { ChatMessage } from '../../services/socket'
import { useNavigate } from 'react-router-dom'

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
        const date = new Date(message?.timestamp)
        const thisYear = date.getFullYear() == new Date().getFullYear()
        const todayDisplay = date.getHours() + ':' + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes()

        if (date.getDate() == new Date().getDate() && thisYear)
            return (date.getHours() < 10 ? '0' : '') + todayDisplay
        if (date.getMonth() == new Date().getMonth() && thisYear) {
            console.log('date');
            return `${date.toLocaleDateString('hu-HU', { year: '2-digit', weekday: 'short', month: 'short', day: 'numeric' })}`
        }
        return date.toLocaleDateString('hu-HU', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })

    }

    return (
        <Box my={1} backgroundColor={isMe ? activeBg : 'transparent'}>
            <HStack>
                <Box w={1} backgroundColor={isMe ? buttonBg : 'transparent'} h={10} borderRadius={10} />
                <HStack>
                    <Text m={0} minW={100} onClick={detailNavigator} _hover={{ cursor: 'pointer' }}><b>{message.sender?.name}:</b></Text>
                    <Text m={0} maxW='55vw'>{message.content}</Text>
                </HStack>
                <Box ml='auto' mr={2} textAlign='end'>
                    <Text my={0} fontStyle='italic'>{handleDate()}</Text>
                </Box>
            </HStack>
        </Box>
    )
}

export default Message