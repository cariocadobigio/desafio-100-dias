import { adminDb } from "@/lib/firebase-admin"
import { getSessionUid } from "@/lib/session"
import { redirect } from "next/navigation"
import Link from "next/link"
import ChallengeClient from "./ChallengeClient"
import { logoutAction } from "@/app/actions/auth"
import { LogOut, ShieldAlert } from "lucide-react"
import { Footer } from "@/components/Footer"

export const runtime = "nodejs"

async function getProgress(uid: string) {
  const ref = adminDb.doc(`users/${uid}/challenge/progress`)
  const snap = await ref.get()
  
  // Definição dos tipos e valores padrão
  const data = snap.exists ? snap.data() : null
  const doneDays = (data?.doneDays as number[]) ?? []
  const goal = (data?.goal as string) ?? "Meu Sonho"
  const totalDays = (data?.totalDays as number) ?? 100 // Padrão 100 se não existir

  return { doneDays, goal, totalDays }
}

export default async function DashboardPage() {
  const uid = await getSessionUid()
  if (!uid) redirect("/login")

  const MASTER_UID = process.env.ADMIN_MASTER_UID
  const isMaster = uid === MASTER_UID

  const progress = await getProgress(uid)

  return (
    <main className="min-h-screen bg-neutral-50 flex flex-col">
      <div className="flex-1 w-full max-w-4xl mx-auto p-6 space-y-6">
        {/* Cabeçalho */}
        <header className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-emerald-200 shadow-lg">
              100
            </div>
            <h1 className="text-2xl font-bold text-neutral-800 tracking-tight">Desafio</h1>
          </div>
          
          <div className="flex items-center gap-2">
            {isMaster && (
              <Link
                href="/admin"
                className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-3 py-2 rounded-lg transition-all font-medium border border-transparent hover:border-indigo-100"
              >
                <ShieldAlert size={18} />
                <span className="hidden sm:inline">Painel Master</span>
              </Link>
            )}

            <div className="h-6 w-px bg-neutral-200 hidden sm:block"></div>

            <form action={logoutAction}>
              <button 
                type="submit"
                className="flex items-center gap-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-2 rounded-lg transition-all font-medium"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </form>
          </div>
        </header>

        {/* Passamos todos os dados para o Cliente */}
        <ChallengeClient 
          initialDoneDays={progress.doneDays} 
          initialGoal={progress.goal}
          initialTotalDays={progress.totalDays}
        />
      </div>

      <Footer />
    </main>
  )
}