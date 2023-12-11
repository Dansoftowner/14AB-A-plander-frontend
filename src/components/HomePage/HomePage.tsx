import React from 'react'
import { AuthContext } from '../../context/authContext'

const HomePage = () => {
    const context = React.useContext(AuthContext)

    return (
        <div>
            <h1>Hello.</h1>
            {context.token && <h2>You are logged in as {context.token}</h2>}
        </div>
    )
}

export default HomePage