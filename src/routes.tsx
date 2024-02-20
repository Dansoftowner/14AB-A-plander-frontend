import { Route, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import LoginPage from './components/LoginPage/LoginPage'
import { RegisterForm } from './components/RegisterForm/RegisterForm';
import Layout from './components/Layout';
import HomePage from './components/HomePage/HomePage';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import MembersList from './components/MembersList/MembersList';
import InviteMember from './components/MembersList/InviteMember';
import MemberDetail from './components/MemberDetail/MemberDetail';
import ErrorPage from './components/ErrorPage/ErrorPage';
import Assignments from './components/Assignments/Assignments';
import Reports from './components/Reports/Reports';
import Chat from './components/Chats/Chat';


const router = createBrowserRouter(
    createRoutesFromElements(
        <Route>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgotten-password" element={<ForgotPassword />}>
                <Route path=":id/:restorationToken" element={<ForgotPassword />} />
            </Route>
            <Route path="/register/:id/:registrationToken" element={<RegisterForm />} />
            <Route path="/" element={<Layout />}>
                <Route path="" element={<HomePage />} />
                <Route path="/chats" element={<Chat />} />
                <Route path="/members" element={<MembersList />} />
                <Route path="/members/invite" element={<InviteMember />} />
                <Route path="/member/:id" element={<MemberDetail />} />
                <Route path="/assignments" element={<Assignments />} />
                <Route path="/reports" element={<Reports />} />
            </Route>
            <Route path="*" element={<ErrorPage status={404} message='404' />} />
        </Route>
    )
)
export default router;