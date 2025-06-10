import { data } from "@remix-run/node"
import { requireUserId } from "@lib/supabase/auth"
import { fetchUserDetails } from "@lib/supabase/server/user"
import { fetchChatHistory } from "@lib/supabase/server/chat"
import { fetchComponentWithTitle } from "@lib/supabase/server/component"

export const loader = async ({
  request,
  params,
}: {
  request: Request
  params: { chatId: string }
}) => {
  const userId = await requireUserId(request)
  const { chatId } = params

  // Fetch user details
  const user = await fetchUserDetails(userId)

  // Fetch component
  const component = await fetchComponentWithTitle(chatId)
  if (!component) {
    throw new Error("Component not found")
  }

  // Fetch chat history
  const chatHistory = await fetchChatHistory(userId)

  return data({
    component: {
      id: component.id,
      title: component.chats?.title || "Untitled Component",
      code: component.code,
      created_at: component.created_at || "No date",
    },
    chatHistory,
    username: user?.username || "User",
  })
}
