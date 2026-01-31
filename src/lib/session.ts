import "server-only"
import { cookies } from "next/headers"
import { adminAuth } from "@/lib/firebase-admin"

const COOKIE_NAME = "__session"

export async function getSessionUid(): Promise<string | null> {
  const cookieStore = await cookies()
  const cookie = cookieStore.get(COOKIE_NAME)?.value

  if (!cookie) return null

  try {
    const decoded = await adminAuth.verifySessionCookie(cookie, true)
    return decoded.uid
  } catch {
    return null
  }
}
