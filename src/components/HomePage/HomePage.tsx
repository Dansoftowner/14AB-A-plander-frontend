import { Button } from '@chakra-ui/button'
import { useLogout } from '../../hooks/useLogin'
import { useLoginForMe } from '../../hooks/useMember'
import { Navigate, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../../context/authContext'
const HomePage = () => {

    const { data, isFetching } = useLoginForMe()
    const { authToken, setUser,user } = useContext(AuthContext)

    const navigate = useNavigate()

    if (!authToken && !isFetching) return <Navigate to='/login' />
    if (data) setUser({ type: 'SET_TOKEN', loggedUser: data })

    return (
        <>
            <h1>Hello {user?.name}!</h1>
            <Button onClick={() => {
                useLogout().then(() => {
                    setUser({ type: 'REMOVE_TOKEN' })
                    localStorage.removeItem("token");
                    navigate('/login')
                })
            }}>
                Logout
            </Button>
        </>
    )
}

export default HomePage