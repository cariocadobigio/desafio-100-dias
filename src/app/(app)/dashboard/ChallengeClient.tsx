"use client"

import { useOptimistic, useTransition } from "react"
import { toggleDayAction } from "@/app/actions/challenge"
import confetti from "canvas-confetti"

type Props = {
  initialDoneDays: number[]
}

function getTotal(doneDays: number[]) {
  return doneDays.reduce((sum, d) => sum + d, 0)
}

export default function ChallengeClient({ initialDoneDays }: Props) {
  const [isPending, startTransition] = useTransition()
  
  const [optimisticDays, setOptimisticDays] = useOptimistic(
    initialDoneDays,
    (state: number[], day: number) => {
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
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#10b981', '#34d399', '#059669']
      })
    }

    // CORREÇÃO: Removemos o async/await daqui.
    // O setOptimisticDays roda imediatamente (síncrono)
    // e a toggleDayAction roda em background, gerida pelo startTransition.
    startTransition(() => {
      setOptimisticDays(day) 
      toggleDayAction({ day })
    })
  }

  return (
    <section className="space-y-6 max-w-4xl mx-auto">
      {/* Cartão Principal */}
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-neutral-200">
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
              <div 
                className="h-full bg-emerald-500 transition-all duration-700 ease-out shadow-[0_0_10px_rgba(16,185,129,0.5)]" 
                style={{ width: `${progressPct}%` }} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Grid de Dias */}
      <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
        {Array.from({ length: 100 }, (_, i) => i + 1).map((day) => {
          const done = optimisticDays.includes(day)
          return (
            <button
              key={day}
              type="button"
              onClick={() => onToggle(day)}
              disabled={isPending}
              className={`
                relative overflow-hidden rounded-xl py-3 text-sm font-bold transition-all duration-200
                ${done 
                  ? "bg-emerald-500 text-white shadow-md scale-95 ring-2 ring-emerald-300" 
                  : "bg-white text-neutral-600 hover:bg-neutral-50 hover:scale-105 border border-neutral-200"}
              `}
            >
              {day}
              {done && (
                <span className="absolute inset-0 bg-white/20 animate-pulse" />
              )}
            </button>
          )
        })}
      </div>
      
      {isPending && (
        <p className="text-center text-xs text-neutral-400 animate-pulse">
          A sincronizar...
        </p>
      )}
    </section>
  )
}