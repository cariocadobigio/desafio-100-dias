import { getSessionUid } from "@/lib/session"
import { redirect } from "next/navigation"
import LoginButton from "./LoginButton"

export const runtime = "nodejs"

export default async function LoginPage() {
  const uid = await getSessionUid()
  if (uid) redirect("/dashboard")

  return (
    <main className="min-h-screen grid place-items-center p-6 bg-neutral-50">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow space-y-4">
        <h1 className="text-2xl font-bold">Entrar</h1>
        <p className="text-sm text-neutral-600">
          Use sua conta Google para acessar o Desafio dos 100 Dias.
        </p>
        <LoginButton />
      </div>
    </main>
  )
}
