import { supabase } from "@lib/supabase/server"
import { Component } from "@/types/component"

export async function fetchComponent(chatId: string) {
  const { data: componentData } = await supabase
    .from("components")
    .select("*")
    .eq("chat_id", chatId)
    .single()

  return componentData
}

export async function fetchComponentWithTitle(chatId: string) {
  const { data: component, error: componentError } = await supabase
    .from("components")
    .select(
      `
      id,
      code,
      chat_id,
      created_at,
      chats!inner (
        title,
        user_id
      )
    `
    )
    .eq("chat_id", chatId)
    .single()

  if (componentError) {
    if (componentError.code === "PGRST116") {
      // This is the specific error code for "not found" when using .single()
      throw new Error(`Component not found for chatId: ${chatId}`)
    }

    throw new Error(`Failed to fetch component: ${componentError.message}`)
  }

  // due to the structure of the database supabase
  // generates a type that is incorrect
  // due to time constraints this is a workaround
  return component as unknown as Component
}

export async function fetchUserComponentsWithTitle(
  userId: string
): Promise<Component[]> {
  const { data: components, error: componentsError } = await supabase
    .from("components")
    .select(
      `
      id,
      code,
      chat_id,
      created_at,
      chats!inner (
        title,
        user_id
      )
    `
    )
    .eq("chats.user_id", userId)
    .order("created_at", { ascending: false })

  if (componentsError) {
    console.error("Failed to fetch user components:", componentsError)
    throw new Error(
      `Failed to fetch user components: ${componentsError.message}`
    )
  }

  if (!components) {
    return []
  }

  // due to the structure of the database supabase
  // generates a type that is incorrect
  // due to time constraints this is a workaround
  return components as unknown as Component[]
}

export async function upsertComponent(chatId: string, code: string) {
  const { data: upsertedComponent, error: upsertError } = await supabase
    .from("components")
    .upsert(
      {
        chat_id: chatId,
        code: code,
      },
      {
        onConflict: "chat_id",
        ignoreDuplicates: false,
      }
    )
    .select()
    .single()

  if (upsertError) {
    throw new Error("Failed to upsert component")
  }

  return upsertedComponent
}

export async function fetchAllComponentsWithTitle(): Promise<Component[]> {
  const { data: components, error: componentsError } = await supabase
    .from("components")
    .select(
      `
      id,
      code,
      chat_id,
      created_at,
      chats!inner (
        title,
        user_id
      )
    `
    )
    .order("created_at", { ascending: false })

  if (componentsError) {
    console.error("Failed to fetch components:", componentsError)
    throw new Error(`Failed to fetch components: ${componentsError.message}`)
  }

  if (!components) {
    return []
  }

  return components as unknown as Component[]
}
