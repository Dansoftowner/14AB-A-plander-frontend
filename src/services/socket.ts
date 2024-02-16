import { Socket, io } from 'socket.io-client'

export let socket: Socket
if (localStorage.getItem('token') || sessionStorage.getItem('token')) {
  socket = io('wss://dev-plander-org.koyeb.app', {
    auth: {
      token: localStorage.getItem('token') || sessionStorage.getItem('token'),
    },
    secure: true,
    autoConnect: true,
  })
}
export interface ChatMessage {
  sender?: {
    _id: string
    name: string
  }
  content?: string
  timestamp: string
}
