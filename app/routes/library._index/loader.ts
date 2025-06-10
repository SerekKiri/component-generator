import { data } from "@remix-run/node"
import { requireUserId } from "@lib/supabase/auth"
import { supabase } from "@lib/supabase/server"
import { fetchAllComponentsWithTitle } from "@lib/supabase/server/component"
import type { LoaderData, MappedComponent } from "./types"

export async function loader({ request }: { request: Request }) {
  const userId = await requireUserId(request)

  // Fetch user details
  const { data: user } = await supabase
    .from("users")
    .select("username")
    .eq("id", userId)
    .single()

  // Fetch all components
  const components = await fetchAllComponentsWithTitle()

  // Fetch chat history
  const { data: chats, error: chatsError } = await supabase
    .from("chats")
    .select("id, title")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (chatsError) {
    throw new Error("Failed to fetch chat history")
  }

  // Map components to include title from the chat
  const mappedComponents: MappedComponent[] = (components || []).map(
    (component) => ({
      id: component.id,
      chatId: component.chat_id || "",
      title: component.chats?.title || "Untitled Component",
      code: component.code,
      createdAt: component.created_at || "No date",
    })
  )

  return data<LoaderData>({
    components: mappedComponents,
    chatHistory: chats,
    username: user?.username || "User",
  })
}
