import { data, type ActionFunctionArgs } from "@remix-run/node"
import { redirect } from "@remix-run/react"
import { supabase } from "@lib/supabase/server"
import { requireUserId } from "@lib/supabase/auth"
import { callClaudeAPI } from "@lib/models/claude"
import { extractCodeFromResponse } from "@/utils/extractCode"

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request)

  if (request.method !== "POST") {
    return data({ error: "Method not allowed" }, { status: 405 })
  }

  try {
    const formData = await request.formData()
    const message = formData.get("message") as string

    if (!message || !message.trim()) {
      return data({ error: "Message is required" }, { status: 400 })
    }

    // Create a new chat
    const { data: chat, error: chatError } = await supabase
      .from("chats")
      .insert([
        {
          user_id: userId,
          title: message.slice(0, 50) + "...", // Use first 50 chars of message as title
        },
      ])
      .select()
      .single()

    if (chatError) {
      throw chatError
    }

    // Save the user's message
    const { error: messageError } = await supabase.from("messages").insert([
      {
        chat_id: chat.id,
        user_id: userId,
        role: "user",
        content: message,
      },
    ])

    if (messageError) {
      throw messageError
    }

    // Generate component using Claude
    const apiKey = process.env.CLAUDE_API_KEY
    if (!apiKey) {
      throw new Error("Claude API key is missing")
    }

    const response = await callClaudeAPI([
      {
        role: "user",
        content: message,
      },
    ])

    const code = extractCodeFromResponse(response.content[0].text)
    if (!code) {
      throw new Error("Failed to generate component code")
    }

    // Save the generated component
    const { error: componentError } = await supabase.from("components").insert([
      {
        chat_id: chat.id,
        code: code,
      },
    ])

    if (componentError) {
      throw componentError
    }

    // Redirect to the chat page
    return redirect(`/app/${chat.id}`)
  } catch (error) {
    console.error("Error in create-chat:", error)
    return data({ error: "Failed to create chat" }, { status: 500 })
  }
}
