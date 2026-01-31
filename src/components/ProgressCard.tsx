type Props = {
  total: number
  progress: number
}

export function ProgressCard({ total, progress }: Props) {
  const GOAL = 5050 // Meta matemática para 100 dias

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-neutral-100 space-y-4">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-sm font-medium text-neutral-500">Total economizado</p>
          <p className="text-4xl font-bold text-emerald-600">R$ {total.toFixed(2)}</p>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-xs text-neutral-400">Meta</p>
          <p className="text-lg font-semibold text-neutral-700">R$ {GOAL.toFixed(2)}</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs font-medium text-neutral-500">
          <span>{progress.toFixed(0)}% concluído</span>
          <span>Faltam R$ {(GOAL - total).toFixed(2)}</span>
        </div>
        
        <div className="w-full bg-neutral-100 h-3 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}