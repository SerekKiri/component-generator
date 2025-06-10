import type { ActionFunctionArgs } from "@remix-run/node"
import { redirect, data } from "@remix-run/node"
import { signup, setUserSession, getUserSession } from "@lib/supabase/auth"

export const action = async ({ request }: ActionFunctionArgs) => {
  const form = await request.formData()
  const username = form.get("username") as string
  const email = form.get("email") as string
  const password = form.get("password") as string
  const repeat = form.get("repeat") as string

  if (!username || !email || !password || !repeat) {
    return data({ error: "All fields are required." }, { status: 400 })
  }

  if (password !== repeat) {
    return data({ error: "Passwords do not match." }, { status: 400 })
  }

  const { data: signupData, error } = await signup({
    username,
    email,
    password,
  })

  if (error) {
    return data({ error: error.message }, { status: 400 })
  }

  if (!signupData) {
    return data({ error: "Signup failed." }, { status: 400 })
  }

  const session = await getUserSession(request)
  const cookie = await setUserSession(signupData.user?.id ?? "", session)

  return redirect("/app", {
    headers: { "Set-Cookie": cookie },
  })
}
