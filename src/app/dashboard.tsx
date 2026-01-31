import { getSessionUid } from "@/lib/session"
import { redirect } from "next/navigation"

export const runtime = "nodejs"

export default async function DashboardPage() {
  const uid = await getSessionUid()
  if (!uid) redirect("/login")

  return (
    <main className="min-h-screen p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="text-neutral-600">Logado com UID: {uid}</p>
    </main>
  )
}
