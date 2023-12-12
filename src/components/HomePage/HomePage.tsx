import { Button } from '@chakra-ui/button'
import { useLogout } from '../../hooks/useLogin'
import { useLoginForMe } from '../../hooks/useMember'
import { Navigate, useNavigate } from 'react-router-dom'
import { Spinner } from '@chakra-ui/react'
const HomePage = () => {

    const { data: user, isFetching } = useLoginForMe()

    const navigate = useNavigate()

    if (!user && isFetching) {
        <Spinner />
    }
    if (!user && !isFetching) return <Navigate to='/login' />

    return (
        <>
            <h1>Hello {user?.name}!</h1>
            <Button onClick={() => {
                useLogout().then(() => {
                    navigate('/login')
                })
            }}>
                Logout
            </Button>
        </>
    )
}

export default HomePage