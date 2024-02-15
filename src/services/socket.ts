import io from 'socket.io-client'

export const socket = io('ws://dev-plander-org.koyeb.app', {
  auth: {
    token: localStorage.getItem('token') || sessionStorage.getItem('token'),
  },
})

export interface ChatMessage {
  sender?: {
    _id: string
    name: string
  }
  content?: string
  timestamp?: string
}
