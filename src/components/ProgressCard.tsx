type Props = {
  total: number
  progress: number
}

export function ProgressCard({ total, progress }: Props) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow space-y-3">
      <p className="text-sm text-gray-500">Total economizado</p>
      <p className="text-3xl font-bold">R$ {total.toFixed(2)}</p>

      <div className="w-full bg-gray-200 h-2 rounded-full">
        <div
          className="h-2 bg-green-500 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="text-xs text-gray-400">
        Progresso: {progress.toFixed(0)}%
      </p>
    </div>
  )
}
