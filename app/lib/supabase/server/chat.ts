import { supabase } from "@lib/supabase/server"
import { Chat } from "@/types/chat"

export async function fetchChatHistory(userId: string): Promise<Chat[]> {
  const { data: chats, error: chatsError } = await supabase
    .from("chats")
    .select("id, title")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (chatsError) {
    throw new Error("Failed to fetch chat history")
  }

  return (chats || []).map((chat) => ({
    id: chat.id,
    title: chat.title,
  }))
}

export async function fetchChat(chatId: string) {
  const { data: chat, error: chatError } = await supabase
    .from("chats")
    .select("*")
    .eq("id", chatId)
    .single()

  if (chatError || !chat) {
    throw new Error("Chat not found")
  }

  return chat
}

export async function updateChatTitle(chatId: string, title: string) {
  const { error } = await supabase
    .from("chats")
    .update({ title })
    .eq("id", chatId)

  if (error) {
    console.error("Error updating chat title:", error)
    throw error
  }

  return
}
