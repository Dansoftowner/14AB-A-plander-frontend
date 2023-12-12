import { useReducer, useState } from 'react'
import NavBar from './NavBar/NavBar'
import { Outlet } from 'react-router-dom'
import { AuthContext } from '../context/authContext'
import { useLoginForMe } from '../hooks/useMember'
import authReducer from '../reducers/authReducer'

const Layout = () => {
    const [authToken, setAuthToken] = useState(
        localStorage.getItem("token") || ""
    );
    const setToken = (token: any) => {
        localStorage.setItem("token", token);
        setAuthToken(token);
    }


    const { data } = useLoginForMe()
    const [user, setUser] = useReducer(authReducer, data!)

    return (
        <>
            <AuthContext.Provider value={{ authToken, setAuthToken: setToken, user, setUser }}>
                <NavBar />
                <Outlet />
            </AuthContext.Provider >
        </>
    )
}

export default Layout