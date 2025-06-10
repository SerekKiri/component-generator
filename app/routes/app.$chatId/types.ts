import type { Component } from "@/types/component"
import type { Chat as ChatType, Message } from "@/types/chat"

export interface LoaderData {
  chat: ChatType
  username: string
  chatHistory: ChatType[]
  messages: Message[]
  component: Component | null
}

export interface ActionData {
  success: boolean
  messages?: Message[]
  component?: Component
  title?: string
  error?: string
}
