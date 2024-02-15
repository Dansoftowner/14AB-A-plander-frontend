import io from 'socket.io-client'

export const socket = io('wss://dev-plander-org.koyeb.app', {
  auth: {
    token: localStorage.getItem('token') || sessionStorage.getItem('token'),
  },
  secure: true,
})

export interface ChatMessage {
  sender?: {
    _id: string
    name: string
  }
  content?: string
  timestamp?: string
}
