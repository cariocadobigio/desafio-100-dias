"use client"

import { useOptimistic, useTransition, useState } from "react"
import { toggleDayAction, resetProgressAction } from "@/app/actions/challenge"
import confetti from "canvas-confetti"
import { motion } from "framer-motion"
import { Trash2, AlertTriangle } from "lucide-react"

type Props = {
  initialDoneDays: number[]
}

function getTotal(doneDays: number[]) {
  return doneDays.reduce((sum, d) => sum + d, 0)
}

export default function ChallengeClient({ initialDoneDays }: Props) {
  const [isPending, startTransition] = useTransition()
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  
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

  const total = getTotal(optimisticDays)
  const progressPct = (optimisticDays.length / 100) * 100
  const GOAL = 5050

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

  // Variantes de animação para a Grid
  const containerVars = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.01 
      }
    }
  }

  const itemVars = {
    hidden: { opacity: 0, scale: 0.8 },
    show: { opacity: 1, scale: 1 }
  }

  return (
    <section className="space-y-8">
      {/* Cartão de Progresso */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="rounded-2xl bg-white p-6 shadow-sm border border-neutral-200"
      >
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
          <div>
            <p className="text-sm font-medium text-neutral-500">Saldo Atual</p>
            <h2 className="text-4xl font-extrabold text-emerald-600">
              R$ {total.toFixed(2)}
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Meta: R$ {GOAL.toFixed(2)}
            </p>
          </div>
          
          <div className="flex-1 sm:max-w-xs w-full">
            <div className="flex justify-between text-xs mb-2 font-medium">
              <span className="text-emerald-700">{progressPct.toFixed(0)}%</span>
              <span className="text-neutral-400">100 Dias</span>
            </div>
            <div className="h-3 w-full rounded-full bg-neutral-100 overflow-hidden">
              <motion.div 
                className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" 
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Grid de Dias Animada */}
      <motion.div 
        variants={containerVars}
        initial="hidden"
        animate="show"
        className="grid grid-cols-5 gap-2 sm:grid-cols-10"
      >
        {Array.from({ length: 100 }, (_, i) => i + 1).map((day) => {
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
                relative overflow-hidden rounded-xl py-3 text-sm font-bold transition-colors duration-200
                ${done 
                  ? "bg-emerald-500 text-white shadow-md ring-2 ring-emerald-300" 
                  : "bg-white text-neutral-600 hover:bg-neutral-50 border border-neutral-200"}
              `}
            >
              {day}
            </motion.button>
          )
        })}
      </motion.div>
      
      {/* Área de Reset (Zona de Perigo) */}
      <div className="pt-8 border-t border-neutral-200">
        {!showResetConfirm ? (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center gap-2 text-xs text-red-400 hover:text-red-600 transition-colors mx-auto"
          >
            <Trash2 size={14} />
            Resetar todo o progresso
          </button>
        ) : (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="bg-red-50 p-4 rounded-xl border border-red-100 max-w-sm mx-auto text-center space-y-3"
          >
            <div className="flex justify-center text-red-500 mb-2">
              <AlertTriangle />
            </div>
            <p className="text-sm text-red-800 font-medium">Tem certeza absoluta?</p>
            <p className="text-xs text-red-600">Isso apagará todo o seu histórico e economias. Não pode ser desfeito.</p>
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
                Sim, apagar tudo
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}