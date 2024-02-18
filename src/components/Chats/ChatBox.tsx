import React, { useEffect, useRef } from 'react'
import { ChatMessage } from '../../services/socket'
import { Box, Button, Divider, Heading, Input, InputGroup, Spinner, useColorModeValue } from '@chakra-ui/react'
import Message from './Message'
import { Socket } from 'socket.io-client'
import { useChats } from '../../hooks/useChats'
import InfiniteScroll from 'react-infinite-scroll-component'

interface Props {
    socket: Socket
}

const ChatBox = ({ socket }: Props) => {

    useEffect(() => {
        socket?.connect()
    }, [socket])

    const { data, fetchNextPage, hasNextPage } = useChats(10)

    const chats = data?.pages.reduce((acc, page) => {
        return [...acc, ...page.items]
    }, [])
    console.log(chats)

    useEffect(() => {
        scrollToBottom()
    }, [])


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
            console.log(messages)
        }
    };

    const endRef = useRef<HTMLDivElement>(null)
    const scrollToBottom = () => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <Box mt={7} boxShadow='dark-lg' maxW='90vw' padding={4} borderRadius={20} mx={2} h={475}>
            <Heading>Üzenetek</Heading>
            <Divider />

            <InfiniteScroll
                dataLength={data ? chats.length : 0}
                next={() => fetchNextPage()}
                hasMore={hasNextPage || false}
                loader={<Spinner />}
                inverse={true}
                height={300}
                style={{ display: "flex", flexDirection: "column-reverse" }}
            >
                <Box>
                    {
                        chats?.map((chat: any) => (
                            <Message key={chat.id} message={chat} />
                        )).reverse()

                    }
                    {messages.map((message, index) => (
                        <Message key={index} message={message} />
                    ))}
                    <div ref={endRef} />
                </Box>
            </InfiniteScroll >
            <InputGroup mt={3}>
                <Input lineHeight={1} onKeyDown={handleKeyPress} mr={2} value={messageText} maxLength={1024} maxW='75vw' onChange={(e) => setMessageText(e.target.value)} placeholder='Írja be az üzenetet...' />
                <Button color={buttonColor} backgroundColor={buttonBg} _hover={{ backgroundColor: buttonHover }} onClick={sendMessage}>Küldés</Button>
            </InputGroup>
        </Box >
    )
}

export default ChatBox