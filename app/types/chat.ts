export interface Chat {
  id: string
  title: string
}

export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  chat_id: string
  user_id: string
}
