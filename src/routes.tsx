import { createBrowserRouter } from 'react-router-dom'
import LoginPage from './components/LoginPage/LoginPage'
import { RegisterForm } from './components/RegisterForm/RegisterForm';
import Layout from './components/Layout';
import HomePage from './components/HomePage/HomePage';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import MembersList from './components/MembersList/MembersList';


const router = createBrowserRouter([
    {
        path: '/login',
        element: <LoginPage />
    },
    {
        path: '/forgotten-password',
        element: <ForgotPassword />,
        children: [
            {
                path: ':id/:restorationToken',
                element: <ForgotPassword />
            }
        ]
    },
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                path: '/register/:id/:registrationToken',
                element: <RegisterForm />,

            },
            {
                path: '',
                element: <HomePage />
            },
            {
                path: '/members',
                element: <MembersList />
            }
        ]
    }

])
export default router;