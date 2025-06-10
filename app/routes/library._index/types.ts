import type { Chat } from "@/types/chat"

export interface MappedComponent {
  id: string
  chatId: string
  title: string
  code: string
  createdAt: string
}

export interface LoaderData {
  components: MappedComponent[]
  chatHistory: Chat[]
  username: string
}
