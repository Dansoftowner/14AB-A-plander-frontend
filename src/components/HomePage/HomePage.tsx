import React from 'react'
import { AuthContext } from '../../context/authContext'
import { Button } from '@chakra-ui/button'
import { useLogout } from '../../hooks/useLogin'
import { useLoginForMe } from '../../hooks/useMember'

const HomePage = () => {
    const context = React.useContext(AuthContext)
    const { data: user, status: loginStatus } = useLoginForMe()
    if (loginStatus === "success") {
        context.dispatch({ type: 'SET_TOKEN', isLoggedIn: true })
    }

    console.log(user);


    return (
        <div>
            <h1>Hello.</h1>
            {!context.isLoggedIn && <h2>You are not logged in.</h2>}
            {context.isLoggedIn &&
                <>
                    <h1>Hello {user?.name}!</h1>
                    <Button onClick={() => {
                        useLogout().then(() => {
                            context.dispatch({ type: 'REMOVE_TOKEN' })
                        })
                    }}>
                        Logout
                    </Button>
                </>}

        </div>
    )
}

export default HomePage