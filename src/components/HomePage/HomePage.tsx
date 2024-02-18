import { Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import useAuth from '../../hooks/useAuth'
import ChatBox from '../Chats/ChatBox'
import { Socket, io } from 'socket.io-client'
import { Spinner } from '@chakra-ui/react'
const HomePage = () => {

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
        if (token) {
            setSocket(io('wss://dev-plander-org.koyeb.app', {
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
        <>
            {
                socket == null ? <Spinner /> : <ChatBox socket={socket!} />
            }

        </>
    )
}

export default HomePage