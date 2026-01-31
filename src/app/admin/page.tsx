import { adminAuth, adminDb } from "@/lib/firebase-admin"
import { getSessionUid } from "@/lib/session"
import { redirect } from "next/navigation"
import { ShieldAlert, Users, PiggyBank, TrendingUp, ArrowLeft } from "lucide-react"
import Link from "next/link"

export const runtime = "nodejs"

// Tipos para os dados
type UserStat = {
  uid: string
  email: string
  name: string
  photoURL?: string
  lastLogin: string
  saved: number
  daysCount: number
  progress: number
}

async function getAdminData() {
  // 1. Buscar todos os usuários
  const listUsersResult = await adminAuth.listUsers(1000)
  const users = listUsersResult.users

  // 2. Buscar todo o progresso (Collection Group Query)
  const progressSnaps = await adminDb.collectionGroup('challenge').get()
  
  const progressMap = new Map<string, { doneDays: number[] }>()
  
  progressSnaps.docs.forEach(doc => {
    // O caminho é users/{uid}/challenge/progress
    // O parent.parent.id deve dar o uid
    const uid = doc.ref.parent.parent?.id
    if (uid && doc.id === 'progress') {
      progressMap.set(uid, doc.data() as { doneDays: number[] })
    }
  })

  // 3. Cruzar os dados
  const stats: UserStat[] = users.map(user => {
    const data = progressMap.get(user.uid) || { doneDays: [] }
    const doneDays = data.doneDays || []
    const saved = doneDays.reduce((a, b) => a + b, 0)
    
    return {
      uid: user.uid,
      email: user.email || "Sem e-mail",
      name: user.displayName || "Anônimo",
      photoURL: user.photoURL,
      lastLogin: user.metadata.lastSignInTime || "",
      saved,
      daysCount: doneDays.length,
      progress: (doneDays.length / 100) * 100
    }
  })

  // Ordenar por quem economizou mais
  return stats.sort((a, b) => b.saved - a.saved)
}

export default async function AdminPage() {
  const uid = await getSessionUid()
  
  // SEGURANÇA MÁXIMA 🔒
  // Busca o UID Mestre das variáveis de ambiente
  const MASTER_UID = process.env.ADMIN_MASTER_UID

  // Se não estiver logado OU se o UID não for o Mestre, redireciona.
  if (!uid || uid !== MASTER_UID) {
    redirect("/dashboard")
  }

  const userStats = await getAdminData()

  // Cálculos Gerais
  const totalUsers = userStats.length
  const totalSavedGlobal = userStats.reduce((acc, curr) => acc + curr.saved, 0)
  const totalCompletedDays = userStats.reduce((acc, curr) => acc + curr.daysCount, 0)

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-200">
              <ShieldAlert size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Painel Master</h1>
              <p className="text-sm text-slate-500">Acesso Restrito ao Admin</p>
            </div>
          </div>
          <Link 
            href="/dashboard"
            className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm hover:shadow transition-all"
          >
            <ArrowLeft size={16} />
            Voltar ao App
          </Link>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                <Users size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-400">Total Usuários</p>
                <h3 className="text-2xl font-bold text-slate-800">{totalUsers}</h3>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                <PiggyBank size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-400">Total Economizado</p>
                <h3 className="text-2xl font-bold text-slate-800">
                  R$ {totalSavedGlobal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </h3>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                <TrendingUp size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-400">Dias Marcados</p>
                <h3 className="text-2xl font-bold text-slate-800">{totalCompletedDays}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Tabela de Usuários */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-800">Ranking Global</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 font-medium">
                <tr>
                  <th className="px-6 py-4">Usuário</th>
                  <th className="px-6 py-4">Economizado</th>
                  <th className="px-6 py-4">Progresso</th>
                  <th className="px-6 py-4">Último Login</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {userStats.map((stat) => (
                  <tr key={stat.uid} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {stat.photoURL ? (
                          <img src={stat.photoURL} alt="" className="w-8 h-8 rounded-full" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">
                            {stat.name[0]?.toUpperCase() || "?"}
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-slate-900">{stat.name}</p>
                          <p className="text-xs text-slate-400 font-mono">{stat.uid.slice(0, 8)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono font-medium text-emerald-600">
                      R$ {stat.saved.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-indigo-500 rounded-full" 
                            style={{ width: `${stat.progress}%` }} 
                          />
                        </div>
                        <span className="text-xs text-slate-500">{stat.progress.toFixed(0)}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {stat.lastLogin ? new Date(stat.lastLogin).toLocaleDateString('pt-BR') : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}