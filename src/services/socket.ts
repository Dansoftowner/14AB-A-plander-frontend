export interface ChatMessage {
  sender?: {
    _id: string
    name: string
  }
  content?: string
  timestamp?: string
}
