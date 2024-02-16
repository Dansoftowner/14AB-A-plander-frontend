import { Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import useAuth from '../../hooks/useAuth'
import ChatBox from '../Chats/ChatBox'
const HomePage = () => {

    const [valid, setValid] = useState(true)
    useEffect(() => {
        if (localStorage.getItem('user')) {

            setUser(JSON.parse(localStorage.getItem('user')!))
        }
        else {
            setUser(JSON.parse(sessionStorage.getItem('user')!))
        }
        if (localStorage.getItem('user') == null && sessionStorage.getItem('user') == null) setValid(false)

    }, [])


    const { setUser } = useAuth()

    if (!valid) return <Navigate to='/login' />
    return (
        <>
            <ChatBox />
        </>
    )
}

export default HomePage