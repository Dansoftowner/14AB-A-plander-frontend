import { Button } from '@chakra-ui/button'
import { Navigate, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import useAuth from '../../hooks/useAuth'
import { User } from '../../hooks/useLogin'
const HomePage = () => {

    const [valid, setValid] = useState(true)
    useEffect(() => {
        if (localStorage.getItem('user') == null && sessionStorage.getItem('user') == null) setValid(false)
    }, [])

    const navigate = useNavigate()

    const { user, setUser } = useAuth()
    useEffect(() => {
        if (localStorage.getItem('user')) {

            setUser(JSON.parse(localStorage.getItem('user')!))
        }
        else {
            setUser(JSON.parse(sessionStorage.getItem('user')!))
        }
    }, [])
    if (!valid) return <Navigate to='/login' />
    return (
        <>
            <h1>Hello {user?.name}!</h1>
            <Button onClick={() => {
                localStorage.removeItem("token");
                sessionStorage.removeItem("token");
                localStorage.removeItem("user");
                sessionStorage.removeItem("user");
                setUser({} as User)
                navigate('/login')

            }}>
                Logout
            </Button>
        </>
    )
}

export default HomePage