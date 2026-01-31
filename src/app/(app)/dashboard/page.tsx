import { adminDb } from "@/lib/firebase-admin"
import { getSessionUid } from "@/lib/session"
import { redirect } from "next/navigation"
import ChallengeClient from "./ChallengeClient"

export const runtime = "nodejs"

async function getProgress(uid: string) {
  const ref = adminDb.doc(`users/${uid}/challenge/progress`)
  const snap = await ref.get()
  const data = snap.exists ? snap.data() as { doneDays?: number[] } : null
  return { doneDays: data?.doneDays ?? [] }
}

export default async function DashboardPage() {
  const uid = await getSessionUid()
  if (!uid) redirect("/login")

  const progress = await getProgress(uid)

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Seu Desafio</h1>
      <ChallengeClient initialDoneDays={progress.doneDays} />
    </main>
  )
}
