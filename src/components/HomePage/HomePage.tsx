import { Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import useAuth from '../../hooks/useAuth'
import ChatBox from '../Chats/ChatBox'
import { Socket, io } from 'socket.io-client'
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
            console.log(sessionStorage.getItem('token'))
            setToken(sessionStorage.getItem('token')!)
        }
        if (localStorage.getItem('user') == null && sessionStorage.getItem('user') == null) setValid(false)

    }, [])


    const [socket, setSocket] = useState<Socket>()
    const { token } = useAuth()
    useEffect(() => {
        console.log('1')
        if (token) {
            console.log('2')
            setSocket(io('wss://dev-plander-org.koyeb.app', {
                auth: {
                    token: token
                },
                secure: true,
                autoConnect: false,
            }))
        }
        // return () => {
        //     socket?.disconnect()
        // }
    }, [token])




    if (!valid) return <Navigate to='/login' />
    return (
        <>
            <ChatBox socket={socket!} />
        </>
    )
}

export default HomePage