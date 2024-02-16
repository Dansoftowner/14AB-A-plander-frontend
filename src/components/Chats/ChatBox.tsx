import React, { useEffect, useRef, useState } from 'react'
import { ChatMessage } from '../../services/socket'
import { Box, Button, Divider, Heading, Input, InputGroup, useColorModeValue } from '@chakra-ui/react'
import Message from './Message'
import { Socket, io } from 'socket.io-client'
import useAuth from '../../hooks/useAuth'


const ChatBox = () => {

    const [socket, setSocket] = useState<Socket>()
    const { token } = useAuth()

    useEffect(() => {
        if (token) {
            setSocket(io('wss://dev-plander-org.koyeb.app', {
                auth: {
                    token: token
                },
                secure: true,
                autoConnect: true,
            }))
        }
    }, [token])



    const [messages, setMessages] = React.useState<ChatMessage[]>([])
    const [messageText, setMessageText] = React.useState("")


    const buttonBg = useColorModeValue('#0078d7', '#fde74c')
    const buttonColor = useColorModeValue('#ffffff', '#004881')
    const buttonHover = useColorModeValue('#0078b0', '#fde7af')


    useEffect(() => {
        socket?.on('recieve-message', (data) => {
            setMessages([...messages, data])
        })
        scrollToBottom()
    }, [messages])

    const handleKeyPress = (e: any) => {
        if (e.key === 'Enter' && e.shiftKey) {
            console.log(e.target.value)
            e.target.value += '\n'
        }
        if (e.key === 'Enter' && !e.shiftKey)
            sendMessage()
    }

    const sendMessage = () => {
        if (messageText?.trim() != "") {
            socket!.emit('send-message', messageText)
            setMessages([...messages, {
                sender: JSON.parse(localStorage.getItem('user')!) || JSON.parse(sessionStorage.getItem('user')!),
                content: messageText,
                timestamp: new Date().toISOString()
            }])
            setMessageText('')
        }
    };

    const endRef = useRef<HTMLDivElement>(null)
    const scrollToBottom = () => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' })
    }



    return (
        <Box mt={7} boxShadow='dark-lg' maxW='90vw' padding={4} borderRadius={20} mx={2} h={455}>
            <Heading>Üzenetek</Heading>
            <Divider />
            <Box height={300} overflowY='auto' maxH={400}>
                {messages.map((message, index) => (
                    <Message key={index} message={message} />
                ))}
                <div ref={endRef} />
            </Box>
            <InputGroup mt={3}>
                <Input lineHeight={1} onKeyDown={handleKeyPress} mr={2} value={messageText} maxLength={1024} maxW='75vw' onChange={(e) => setMessageText(e.target.value)} placeholder='Írja be az üzenetet...' />
                <Button color={buttonColor} backgroundColor={buttonBg} _hover={{ backgroundColor: buttonHover }} onClick={sendMessage}>Küldés</Button>
            </InputGroup>
        </Box>
    )
}

export default ChatBox