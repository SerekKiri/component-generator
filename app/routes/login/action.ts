import type { ActionFunctionArgs } from "@remix-run/node"
import { redirect, data } from "@remix-run/node"
import { login, setUserSession, getUserSession } from "@lib/supabase/auth"

export const action = async ({ request }: ActionFunctionArgs) => {
  const form = await request.formData()
  const email = form.get("email") as string
  const password = form.get("password") as string
  const redirectTo = (form.get("redirectTo") as string) || "/app"

  if (!email || !password) {
    return data({ error: "Email and password are required." }, { status: 400 })
  }

  const { data: loginData, error } = await login({ email, password })

  if (error) {
    return data({ error: error.message }, { status: 400 })
  }

  if (!loginData || !loginData.session) {
    return data({ error: "Login failed." }, { status: 400 })
  }

  const remixSession = await getUserSession(request)
  const cookie = await setUserSession(loginData.session.user.id, remixSession)

  return redirect(redirectTo, {
    headers: { "Set-Cookie": cookie },
  })
}
