export interface Component {
  id: string
  code: string
  transformedCode: string
  chat_id: string
  created_at?: string
  chats?: {
    id: string
    title: string
  }
}
