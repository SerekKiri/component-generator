import { supabase } from "./server"
import { getSession, commitSession, destroySession } from "./session"
import type { Session } from "@remix-run/node"
import { redirect } from "@remix-run/node"

export async function signup({
  username,
  email,
  password,
}: {
  username: string
  email: string
  password: string
}) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username },
    },
  })
  return { data, error }
}

export async function login({
  email,
  password,
}: {
  email: string
  password: string
}) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export async function getUserSession(request: Request) {
  const cookie = request.headers.get("Cookie")
  return await getSession(cookie)
}

export async function requireUserId(request: Request) {
  const session = await getUserSession(request)
  const userId = session.get("userId")

  if (!userId) {
    const url = new URL(request.url)
    throw redirect(`/login?redirectTo=${encodeURIComponent(url.pathname)}`)
  }

  return userId
}

export async function setUserSession(userId: string, session: Session) {
  session.set("userId", userId)
  return await commitSession(session)
}

export async function logout(request: Request) {
  const session = await getUserSession(request)
  return await destroySession(session)
}

export async function redirectIfLoggedIn(request: Request) {
  const session = await getUserSession(request)
  const userId = session.get("userId")

  if (userId) {
    throw redirect("/app")
  }

  return null
}
