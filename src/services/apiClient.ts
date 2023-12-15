import axios from 'axios'

export default axios.create({
  baseURL: 'https://dev-plander-org.koyeb.app/api',
  withCredentials: true,
  headers: {
    'x-plander-auth': localStorage.getItem('token'),
  },
})
