import { Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import useAuth from '../../hooks/useAuth'
import ChatBox from '../Chats/ChatBox'
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




    if (!valid) return <Navigate to='/login' />
    return (
        <>
            <ChatBox />
        </>
    )
}

export default HomePage