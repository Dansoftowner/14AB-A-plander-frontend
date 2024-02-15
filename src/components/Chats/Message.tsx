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

    return (
        <Box my={1} backgroundColor={isMe ? activeBg : 'transparent'}>
            <HStack>
                <Box w={1} backgroundColor={isMe ? buttonBg : 'transparent'} h={10} borderRadius={10} />
                <HStack>
                    <Text m={0} onClick={detailNavigator} _hover={{ cursor: 'pointer' }}><b>{message.sender?.name}:</b></Text>
                    <Text m={0}>{message.content}</Text>
                </HStack>
            </HStack>
        </Box>
    )
}

export default Message