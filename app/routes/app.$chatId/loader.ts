import { data } from "@remix-run/node"
import type { LoaderFunctionArgs } from "@remix-run/node"
import { fetchUserDetails } from "@/lib/supabase/server/user"
import { fetchMessages } from "@/lib/supabase/server/message"
import { fetchComponent } from "@/lib/supabase/server/component"
import { fetchChat, fetchChatHistory } from "@/lib/supabase/server/chat"
import { requireUserId } from "@/lib/supabase/auth"
import type { LoaderData } from "./types"

export async function loader({ request, params }: LoaderFunctionArgs) {
  const userId = await requireUserId(request)
  const chatId = params.chatId
  if (!chatId) {
    throw new Error("Chat ID is required")
  }

  try {
    const chat = await fetchChat(chatId)
    const user = await fetchUserDetails(userId)
    const chatHistory = await fetchChatHistory(userId)
    const messages = await fetchMessages(chatId)
    const component = await fetchComponent(chatId)

    return data<LoaderData>({
      chat,
      username: user?.username || "User",
      chatHistory,
      messages,
      component,
    })
  } catch (error) {
    console.error("Error in loader:", error)
    throw error
  }
}
