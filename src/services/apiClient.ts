import axios from 'axios'

localStorage.getItem('token')

export default axios.create({
  baseURL: 'https://plander-dev.onrender.com/api',
  withCredentials: true,
  headers: {
    'x-plander-auth': 'application/json',
  },
})
