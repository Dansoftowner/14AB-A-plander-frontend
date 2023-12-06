import { createBrowserRouter } from 'react-router-dom'
import LoginPage from './components/LoginPage/LoginPage'
import { RegisterForm } from './components/RegisterForm/RegisterForm';
import Layout from './components/Layout';


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
                path: 'register/:uid/:token',
                element: <RegisterForm />
            }
        ]
    }

])
export default router;