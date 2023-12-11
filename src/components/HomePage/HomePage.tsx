import React from 'react'
import { AuthContext } from '../../context/authContext'
import { Button } from '@chakra-ui/button'
import { useLoginForMe, useLogout } from '../../hooks/useLogin'

const HomePage = () => {
    const context = React.useContext(AuthContext)
    const { data: user } = useLoginForMe()
    console.log(user);


    return (
        <div>
            <h1>Hello.</h1>
            {!context.isLoggedIn && <h2>You are not logged in.</h2>}
            {context.isLoggedIn &&
                <>
                    <Button onClick={() => {
                        context.dispatch({ type: 'REMOVE_TOKEN' })
                        useLogout()
                    }}>
                        Logout
                    </Button>
                </>}
        </div>
    )
}

export default HomePage