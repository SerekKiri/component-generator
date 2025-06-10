import { data } from "@remix-run/node"
import { supabase } from "@lib/supabase/server"
import { requireUserId } from "@lib/supabase/auth"

interface Chat {
  id: string
  title: string
}

export const loader = async ({ request }: { request: Request }) => {
  const userId = await requireUserId(request)

  // Fetch user details
  const { data: user } = await supabase
    .from("users")
    .select("username")
    .eq("id", userId)
    .single()

  // Fetch chat history
  const { data: chats, error } = await supabase
    .from("chats")
    .select("id, title")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error("Failed to fetch chat history")
  }

  const chatHistory: Chat[] = (chats || []).map((chat) => ({
    id: chat.id,
    title: chat.title,
  }))

  return data({
    username: user?.username || "User",
    chatHistory,
  })
}
