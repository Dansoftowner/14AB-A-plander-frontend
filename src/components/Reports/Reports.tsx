import { useEffect, useState } from 'react'
import CalendarComponent from '../Assignments/CalendarComponent'
import { Navigate } from 'react-router-dom'

const Reports = () => {

    const [valid, setValid] = useState(true)
    useEffect(() => {
        if (localStorage.getItem('token') == null && sessionStorage.getItem('token') == null) setValid(false)
    }, [])

    if (!valid) return <Navigate to='/login' />


    return (
        <>
            <CalendarComponent />
        </>
    )
}

export default Reports