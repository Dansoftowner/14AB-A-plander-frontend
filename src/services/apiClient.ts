import axios from 'axios'

export default axios.create({
  baseURL: 'https://plander-dev.onrender.com/api',
  withCredentials: true,
  headers: {
    // 'x-plander-auth': localStorage.getItem('token'),
  },
})
