import { createBrowserRouter } from 'react-router-dom'
import LoginPage from './components/LoginPage/LoginPage'
import { RegisterForm } from './components/RegisterForm/RegisterForm';
import Layout from './components/Layout';
import HomePage from './components/HomePage/HomePage';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';


const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                path: 'login',
                element: <LoginPage />
            },
            {
                path: '/register/:id/:registrationToken',
                element: <RegisterForm />,

            },
            {
                path: '',
                element: <HomePage />
            },
            {
                path: 'forgotten-password',
                element: <ForgotPassword />,
                children: [
                    {
                        path: ':id/:restorationToken',
                        element: <ForgotPassword />
                    }
                ]
            }
        ]
    }

])
export default router;