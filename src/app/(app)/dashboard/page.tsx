import { adminDb } from "@/lib/firebase-admin"
import { getSessionUid } from "@/lib/session"
import { redirect } from "next/navigation"
import ChallengeClient from "./ChallengeClient"
import { logoutAction } from "@/app/actions/auth" // Importa a ação de logout
import { LogOut } from "lucide-react" // Ícone de sair
import { Footer } from "@/components/Footer" // O rodapé que criamos antes

export const runtime = "nodejs"

async function getProgress(uid: string) {
  const ref = adminDb.doc(`users/${uid}/challenge/progress`)
  const snap = await ref.get()
  const data = snap.exists ? snap.data() as { doneDays?: number[] } : null
  return { doneDays: data?.doneDays ?? [] }
}

export default async function DashboardPage() {
  const uid = await getSessionUid()
  
  // Se não tiver UID, redireciona para login
  if (!uid) redirect("/login")

  const progress = await getProgress(uid)

  return (
    <main className="min-h-screen bg-neutral-50 flex flex-col">
      <div className="flex-1 w-full max-w-4xl mx-auto p-6 space-y-6">
        {/* Cabeçalho com Botão de Logout */}
        <header className="flex items-center justify-between py-4">
          <h1 className="text-2xl font-bold text-neutral-800">Desafio 100 Dias</h1>
          
          <form action={logoutAction}>
            <button 
              type="submit"
              className="flex items-center gap-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-2 rounded-lg transition-all font-medium"
              title="Sair da conta"
            >
              <LogOut size={18} />
              <span>Sair</span>
            </button>
          </form>
        </header>

        {/* Cliente do Desafio */}
        <ChallengeClient initialDoneDays={progress.doneDays} />
      </div>

      {/* Rodapé */}
      <Footer />
    </main>
  )
}