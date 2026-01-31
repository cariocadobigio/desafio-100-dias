"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation" // Adicionado para redirecionar
import { adminAuth } from "@/lib/firebase-admin"

export type ActionResult = { success: boolean; message: string }

const COOKIE_NAME = "__session"
const FIVE_DAYS_MS = 5 * 24 * 60 * 60 * 1000

export async function createSessionAction(
  _: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    const idToken = String(formData.get("idToken") ?? "")
    if (!idToken) return { success: false, message: "Token ausente." }

    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: FIVE_DAYS_MS,
    })

    const cookieStore = await cookies()
    cookieStore.set(COOKIE_NAME, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: Math.floor(FIVE_DAYS_MS / 1000),
    })

    return { success: true, message: "Sessão criada." }
  } catch {
    return { success: false, message: "Falha ao autenticar." }
  }
}

// CORREÇÃO: Retorna Promise<void> e faz redirect
export async function logoutAction(_?: FormData): Promise<void> {
  const cookieStore = await cookies()
  
  // Limpa o cookie da sessão
  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  })

  // Redireciona para o login (isso lança um erro interno do Next.js, por isso não usamos try/catch aqui)
  redirect("/login")
}