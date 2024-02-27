import axios from 'axios'

export default axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
  headers: {
    'x-plander-auth': localStorage.getItem('token'),
  },
})
