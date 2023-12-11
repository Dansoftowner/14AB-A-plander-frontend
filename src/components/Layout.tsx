import React, { useReducer } from 'react'
import NavBar from './NavBar/NavBar'
import { Outlet } from 'react-router-dom'
import { AuthContext } from '../context/authContext'
import authReducer from '../reducers/authReducer'

const Layout = () => {
    const [isLoggedIn, dispatch] = useReducer(authReducer, false)
    return (
        <>
            <AuthContext.Provider value={{ isLoggedIn, dispatch }}>
                <NavBar />
                <Outlet />
            </AuthContext.Provider>
        </>
    )
}

export default Layout