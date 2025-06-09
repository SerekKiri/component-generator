import { supabase } from "@lib/supabase/server"

export async function fetchUserDetails(userId: string) {
  const { data: user } = await supabase
    .from("users")
    .select("username")
    .eq("id", userId)
    .single()

  return user
}
