import { Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import useAuth from '../../hooks/useAuth'
import ChatBox from '../Chats/ChatBox'
import { Socket, io } from 'socket.io-client'
import { ScaleFade, Spinner } from '@chakra-ui/react'
const Chat = () => {

    const [valid, setValid] = useState(true)
    const { setUser, setToken } = useAuth()
    useEffect(() => {
        if (localStorage.getItem('user')) {
            setUser(JSON.parse(localStorage.getItem('user')!))
            setToken(localStorage.getItem('token')!)
        }
        else {
            setUser(JSON.parse(sessionStorage.getItem('user')!))
            setToken(sessionStorage.getItem('token')!)
        }
        if (localStorage.getItem('user') == null && sessionStorage.getItem('user') == null) setValid(false)

    }, [])


    const [socket, setSocket] = useState<Socket>()
    const { token } = useAuth()
    useEffect(() => {
        const url = import.meta.env.VITE_BACKEND_SOCKET_URL
        if (token) {
            setSocket(io(url!, {
                auth: {
                    token: token
                },
                secure: true,
                autoConnect: false,
            }))
        } else {
            setSocket(undefined)
        }
        socket?.connect()
    }, [token])




    if (!valid) return <Navigate to='/login' />
    return (
        <ScaleFade in>
            {
                socket == null ? <Spinner /> : <ChatBox socket={socket!} />
            }

        </ScaleFade>
    )
}

export default Chat