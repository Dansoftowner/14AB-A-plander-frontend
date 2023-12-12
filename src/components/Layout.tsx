import { useReducer } from 'react'
import NavBar from './NavBar/NavBar'
import { Navigate, Outlet } from 'react-router-dom'
import { AuthContext } from '../context/authContext'
import authReducer from '../reducers/authReducer'
import { useLoginForMe } from '../hooks/useMember'

const Layout = () => {
    const { data, isFetching } = useLoginForMe()

    // if (!data && !isFetching) return <Navigate to='/login' />

    const [user, dispatch] = useReducer(authReducer, data!)

    return (
        <>
            <AuthContext.Provider value={{ user, dispatch }}>
                <NavBar />
                <Outlet />
            </AuthContext.Provider >
        </>
    )
}

export default Layout