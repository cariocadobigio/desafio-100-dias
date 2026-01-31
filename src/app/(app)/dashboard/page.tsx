import { adminDb } from "@/lib/firebase-admin"
import { getSessionUid } from "@/lib/session"
import { redirect } from "next/navigation"
import Link from "next/link" // Importar Link
import ChallengeClient from "./ChallengeClient"
import { logoutAction } from "@/app/actions/auth"
import { LogOut, ShieldAlert } from "lucide-react" // Adicionei ShieldAlert
import { Footer } from "@/components/Footer"

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

  // VERIFICAÇÃO DO MASTER
  const MASTER_UID = process.env.ADMIN_MASTER_UID
  const isMaster = uid === MASTER_UID

  const progress = await getProgress(uid)

  return (
    <main className="min-h-screen bg-neutral-50 flex flex-col">
      <div className="flex-1 w-full max-w-4xl mx-auto p-6 space-y-6">
        {/* Cabeçalho */}
        <header className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
          <h1 className="text-2xl font-bold text-neutral-800">Desafio 100 Dias</h1>
          
          <div className="flex items-center gap-2">
            {/* BOTÃO ADMIN - Só aparece para o Mestre */}
            {isMaster && (
              <Link
                href="/admin"
                className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-3 py-2 rounded-lg transition-all font-medium border border-transparent hover:border-indigo-100"
                title="Acessar Painel Master"
              >
                <ShieldAlert size={18} />
                <span>Painel Master</span>
              </Link>
            )}

            <div className="h-6 w-px bg-neutral-200 hidden sm:block"></div>

            {/* Botão Sair */}
            <form action={logoutAction}>
              <button 
                type="submit"
                className="flex items-center gap-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-2 rounded-lg transition-all font-medium"
                title="Sair da conta"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </form>
          </div>
        </header>

        <ChallengeClient initialDoneDays={progress.doneDays} />
      </div>

      <Footer />
    </main>
  )
}