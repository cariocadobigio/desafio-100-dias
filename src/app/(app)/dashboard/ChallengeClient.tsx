"use client"

import { useOptimistic, useTransition } from "react"
import { toggleDayAction } from "@/app/actions/challenge"

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

  function onToggle(day: number) {
    setOptimisticDays(day)

    startTransition(async () => {
      await toggleDayAction({ day })
    })
  }

  return (
    <section className="space-y-4">
      <div className="rounded-2xl bg-white p-5 shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-neutral-500">Total economizado</p>
            <p className="text-3xl font-bold">R$ {total.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-neutral-500">Progresso</p>
            <p className="text-xl font-semibold">{progressPct.toFixed(0)}%</p>
          </div>
        </div>

        <div className="mt-4 h-2 w-full rounded-full bg-neutral-200">
          <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${progressPct}%` }} />
        </div>

        {isPending && <p className="mt-3 text-xs text-neutral-500">Salvando...</p>}
      </div>

      <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
        {Array.from({ length: 100 }, (_, i) => i + 1).map((day) => {
          const done = optimisticDays.includes(day)
          return (
            <button
              key={day}
              type="button"
              onClick={() => onToggle(day)}
              className={[
                "rounded-xl px-2 py-3 text-sm font-semibold transition",
                done ? "bg-emerald-500 text-white" : "bg-neutral-100 hover:bg-neutral-200",
              ].join(" ")}
            >
              {day}
            </button>
          )
        })}
      </div>
    </section>
  )
}
