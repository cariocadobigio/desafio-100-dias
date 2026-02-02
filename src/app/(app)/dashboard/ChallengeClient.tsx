"use client"

import { useOptimistic, useTransition, useState } from "react"
import { toggleDayAction, resetProgressAction, saveGoalAction } from "@/app/actions/challenge"
import confetti from "canvas-confetti"
import { motion } from "framer-motion"
import { Trash2, AlertTriangle, Pencil, Save, X, Calculator } from "lucide-react"

type Props = {
  initialDoneDays: number[]
  initialGoal?: string
  initialTotalDays?: number
}

function calculateTotalGoal(days: number) {
  // Fórmula da Soma de Gauss: (n * (n + 1)) / 2
  return (days * (days + 1)) / 2
}

function getTotalSaved(doneDays: number[]) {
  return doneDays.reduce((sum, d) => sum + d, 0)
}

export default function ChallengeClient({ initialDoneDays, initialGoal, initialTotalDays = 100 }: Props) {
  const [isPending, startTransition] = useTransition()
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  
  // Estados Locais
  const [isEditingGoal, setIsEditingGoal] = useState(false)
  const [goalTitle, setGoalTitle] = useState(initialGoal || "Meu Sonho")
  const [totalDays, setTotalDays] = useState(initialTotalDays)
  
  // Estado temporário para o Slider durante edição
  const [tempTotalDays, setTempTotalDays] = useState(initialTotalDays)

  const [optimisticDays, setOptimisticDays] = useOptimistic(
    initialDoneDays,
    (state: number[], action: { type: 'toggle' | 'reset', day?: number }) => {
      if (action.type === 'reset') return []
      
      const day = action.day!
      const has = state.includes(day)
      const next = has ? state.filter((d) => d !== day) : [...state, day]
      return next.sort((a, b) => a - b)
    }
  )

  const currentSaved = getTotalSaved(optimisticDays)
  const goalValue = calculateTotalGoal(totalDays)
  const progressPct = Math.min((optimisticDays.length / totalDays) * 100, 100)

  // Valor calculado dinamicamente enquanto arrasta o slider
  const editingGoalValue = calculateTotalGoal(tempTotalDays)

  function onToggle(day: number) {
    const isCompleting = !optimisticDays.includes(day)
    
    if (isCompleting) {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#10b981', '#34d399', '#059669']
      })
    }

    startTransition(() => {
      setOptimisticDays({ type: 'toggle', day })
      toggleDayAction({ day })
    })
  }

  function onReset() {
    startTransition(async () => {
      setOptimisticDays({ type: 'reset' })
      await resetProgressAction()
      setShowResetConfirm(false)
    })
  }

  async function handleSaveGoal(formData: FormData) {
    const newTitle = formData.get("title") as string
    const newDays = Number(formData.get("totalDays"))
    
    if (newTitle) setGoalTitle(newTitle)
    if (newDays) setTotalDays(newDays)
    
    setIsEditingGoal(false)
    await saveGoalAction(formData)
  }

  const containerVars = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.005 } }
  }
  const itemVars = {
    hidden: { opacity: 0, scale: 0.8 },
    show: { opacity: 1, scale: 1 }
  }

  return (
    <section className="space-y-8">
      {/* Cartão Principal */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="rounded-2xl bg-white p-6 shadow-sm border border-neutral-200 relative overflow-hidden"
      >
        <div className="flex flex-col gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div className="w-full">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium text-neutral-500">Objetivo</p>
                
                {!isEditingGoal && (
                  <button 
                    onClick={() => {
                      setTempTotalDays(totalDays) // Reseta o slider para o valor atual
                      setIsEditingGoal(true)
                    }}
                    className="text-xs flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-medium transition-colors bg-emerald-50 px-2 py-1 rounded-md"
                  >
                    <Pencil size={12} />
                    Configurar Meta
                  </button>
                )}
              </div>

              {isEditingGoal ? (
                <form action={handleSaveGoal} className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-4 animate-in fade-in slide-in-from-top-2">
                  {/* Input Título */}
                  <div>
                    <label className="text-xs font-bold text-neutral-500 uppercase mb-1 block">Nome da Meta</label>
                    <input 
                      name="title"
                      defaultValue={goalTitle}
                      autoFocus
                      maxLength={30}
                      className="w-full text-lg font-bold text-neutral-800 border-b-2 border-emerald-500 focus:outline-none bg-transparent placeholder:text-neutral-300 py-1"
                      placeholder="Ex: Férias, PS5, Formatura..."
                    />
                  </div>

                  {/* Slider de Dias */}
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <label className="text-xs font-bold text-neutral-500 uppercase">Duração / Dificuldade</label>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-emerald-600 block leading-none">
                          R$ {editingGoalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                        <span className="text-xs text-neutral-400 font-medium">
                          em {tempTotalDays} dias
                        </span>
                      </div>
                    </div>
                    
                    <input 
                      type="range" 
                      name="totalDays"
                      min="10" 
                      max="100" 
                      step="1"
                      value={tempTotalDays}
                      onChange={(e) => setTempTotalDays(Number(e.target.value))}
                      className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                    <div className="flex justify-between text-[10px] text-neutral-400 mt-1 font-mono uppercase">
                      <span>Iniciante (10d)</span>
                      <span>Mestre (100d)</span>
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end pt-2">
                    <button type="button" onClick={() => setIsEditingGoal(false)} className="px-3 py-2 text-sm text-neutral-500 hover:bg-neutral-200 rounded-lg transition-colors">
                      Cancelar
                    </button>
                    <button type="submit" className="px-4 py-2 bg-emerald-600 text-white text-sm font-bold rounded-lg hover:bg-emerald-700 shadow-sm flex items-center gap-2">
                      <Save size={16} /> Salvar Alterações
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-1">
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-800 tracking-tight truncate">
                    {goalTitle}
                  </h2>
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-3xl sm:text-4xl font-extrabold text-emerald-600">
                      R$ {currentSaved.toFixed(2)}
                    </span>
                    <span className="text-sm text-neutral-400 font-medium">
                      / R$ {goalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Barra de Progresso */}
          {!isEditingGoal && (
            <div className="w-full">
              <div className="flex justify-between text-xs mb-2 font-medium">
                <span className="text-emerald-700">{progressPct.toFixed(0)}% Concluído</span>
                <span className="text-neutral-400">{totalDays} Dias</span>
              </div>
              <div className="h-4 w-full rounded-full bg-neutral-100 overflow-hidden border border-neutral-100">
                <motion.div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)] relative" 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                >
                  <div className="absolute top-0 left-0 w-full h-full bg-white/20 animate-pulse" />
                </motion.div>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Grid Dinâmico */}
      <motion.div 
        key={totalDays} // Força re-render animação quando muda o tamanho
        variants={containerVars}
        initial="hidden"
        animate="show"
        className="grid grid-cols-5 gap-2 sm:grid-cols-10"
      >
        {Array.from({ length: totalDays }, (_, i) => i + 1).map((day) => {
          const done = optimisticDays.includes(day)
          return (
            <motion.button
              key={day}
              variants={itemVars}
              onClick={() => onToggle(day)}
              disabled={isPending}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              className={`
                relative overflow-hidden rounded-xl py-3 text-sm font-bold transition-all duration-200 border
                ${done 
                  ? "bg-emerald-500 text-white border-emerald-400 shadow-md ring-2 ring-emerald-200/50" 
                  : "bg-white text-neutral-600 border-neutral-200 hover:border-emerald-200 hover:bg-emerald-50/30"}
              `}
            >
              {day}
              {done && (
                <span className="absolute inset-0 bg-white/20" />
              )}
            </motion.button>
          )
        })}
      </motion.div>
      
      {/* Reset Area */}
      <div className="pt-10 border-t border-neutral-200 text-center">
        {!showResetConfirm ? (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="inline-flex items-center gap-2 text-xs text-neutral-400 hover:text-red-500 transition-colors"
          >
            <Trash2 size={14} />
            Resetar desafio
          </button>
        ) : (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="bg-red-50 p-4 rounded-xl border border-red-100 max-w-sm mx-auto space-y-3 inline-block w-full"
          >
            <div className="flex justify-center text-red-500 mb-2">
              <AlertTriangle />
            </div>
            <p className="text-sm text-red-800 font-medium">Tem certeza? Isso apaga todo o progresso.</p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 bg-white text-neutral-600 text-xs font-medium rounded-lg border border-neutral-200 hover:bg-neutral-50"
              >
                Cancelar
              </button>
              <button
                onClick={onReset}
                className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 shadow-sm"
              >
                Sim, zerar
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}