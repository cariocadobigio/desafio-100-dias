import "server-only"
import { cookies } from "next/headers"
import { adminAuth } from "@/lib/firebase-admin"

const COOKIE_NAME = "__session"
const FIVE_DAYS_MS = 5 * 24 * 60 * 60 * 1000

// ✅ LER cookie (permitido)
export async function getSessionUid(): Promise<string | null> {
  const cookieStore = cookies()
  const cookie = cookieStore.get(COOKIE_NAME)

  if (!cookie) return null

  try {
    const decoded = await adminAuth.verifySessionCookie(cookie.value, true)
    return decoded.uid
  } catch {
    return null
  }
}

// ❌ NÃO criamos cookie aqui
// ❌ NÃO apagamos cookie aqui
