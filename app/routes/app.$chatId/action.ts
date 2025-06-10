import { data } from "@remix-run/node"
import type { ActionFunctionArgs } from "@remix-run/node"
import {
  callClaudeAPI,
  CLAUDE_SYSTEM_PROMPT,
  CLAUDE_SYSTEM_PROMPT_IMPROVE_COMPONENT,
} from "@/lib/models/claude"
import { extractCodeFromResponse } from "@/utils/extractCode"
import { saveMessage } from "@/lib/supabase/server/message"
import { upsertComponent } from "@/lib/supabase/server/component"
import { updateChatTitle } from "@/lib/supabase/server/chat"
import { requireUserId } from "@/lib/supabase/auth"
import type { ActionData } from "./types"

export async function action({ request, params }: ActionFunctionArgs) {
  const chatId = params.chatId
  const userId = await requireUserId(request)

  if (!chatId) {
    throw new Error("Chat ID is required")
  }

  const formData = await request.formData()
  const message = formData.get("message") as string
  const messages = JSON.parse(formData.get("messages") as string)
  const component = JSON.parse(formData.get("component") as string)
  const title = formData.get("title") as string

  if (title) {
    // Update chat title
    await updateChatTitle(chatId, title)
    return data<ActionData>({ success: true, title })
  }

  if (!message) {
    return data<ActionData>(
      { success: false, error: "Message is required" },
      { status: 400 }
    )
  }

  try {
    const savedUserMessage = await saveMessage({
      role: "user",
      content: message,
      chat_id: chatId || "",
      user_id: userId || "",
    })

    if (!savedUserMessage) {
      return data<ActionData>(
        { success: false, error: "Failed to save user message" },
        { status: 500 }
      )
    }

    let componentPrompt = CLAUDE_SYSTEM_PROMPT

    if (component) {
      componentPrompt = CLAUDE_SYSTEM_PROMPT_IMPROVE_COMPONENT(
        component.code,
        message
      )
    }

    const response = await callClaudeAPI([
      { role: "user", content: componentPrompt },
    ])

    const extractedCode = extractCodeFromResponse(response.content[0].text)
    let updatedComponent = component

    if (extractedCode) {
      // Save the new component
      updatedComponent = await upsertComponent(chatId, extractedCode)
    }

    return data<ActionData>({
      success: true,
      messages: [...messages, savedUserMessage],
      component: updatedComponent,
    })
  } catch (error) {
    console.error("Error in action:", error)
    return data<ActionData>(
      { success: false, error: "Failed to process message" },
      { status: 500 }
    )
  }
}
