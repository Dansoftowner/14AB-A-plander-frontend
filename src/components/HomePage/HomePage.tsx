import { Button } from '@chakra-ui/button'
import { useLogout } from '../../hooks/useLogin'
import { useLoginForMe } from '../../hooks/useMember'
import { Navigate, useNavigate } from 'react-router-dom'
import { Spinner } from '@chakra-ui/react'
import { useContext, useState } from 'react'
import { AuthContext } from '../../context/authContext'
const HomePage = () => {

    const { data, isFetching } = useLoginForMe()
    const { user, dispatch } = useContext(AuthContext)
    console.log(user);


    const navigate = useNavigate()

    dispatch({ type: 'SET_TOKEN', loggedUser: data! })
    if (!data && !isFetching) return <Navigate to='/login' />

    return (
        <>
            <h1>Hello {data?.name}!</h1>
            <Button onClick={() => {
                useLogout().then(() => {
                    navigate('/login')
                    dispatch({ type: 'REMOVE_TOKEN' })
                })
            }}>
                Logout
            </Button>
        </>
    )
}

export default HomePage