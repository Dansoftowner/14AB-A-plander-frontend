import { useState, useEffect } from 'react'
import { AuthContext } from '../context/authContext'
import NavBar from './NavBar/NavBar'
import { Outlet } from 'react-router-dom'

const Layout = () => {
    const [user, setUser] = useState(JSON.parse(sessionStorage.getItem('user')!) || JSON.parse(localStorage.getItem('user')!))

    useEffect(() => {
        if (localStorage.getItem('user')) setUser(JSON.parse(localStorage.getItem('user')!))
        else setUser(JSON.parse(sessionStorage.getItem('user')!))
    }, [])
    return (
        <>
            <AuthContext.Provider value={{ user, setUser }}>
                <NavBar />
                <Outlet />
            </AuthContext.Provider>

        </>
    )
}

export default Layout