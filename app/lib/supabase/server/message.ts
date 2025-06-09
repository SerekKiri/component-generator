import { supabase } from "@lib/supabase/server"
import { Message } from "@/types/chat"

export async function fetchMessages(chatId: string): Promise<Message[]> {
  const { data: messages, error: messagesError } = await supabase
    .from("messages")
    .select("*")
    .eq("chat_id", chatId)
    .order("created_at", { ascending: true })

  if (messagesError) {
    throw new Error("Failed to fetch messages")
  }

  return messages || []
}

export async function saveMessage(newMessage: Omit<Message, "id">) {
  const { data: message, error: messageError } = await supabase
    .from("messages")
    .insert([newMessage])
    .select()
    .single()

  if (messageError) {
    throw new Error("Failed to save user message")
  }

  return message
}
