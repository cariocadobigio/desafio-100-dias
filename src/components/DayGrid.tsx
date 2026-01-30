type Props = {
  doneDays: number[]
  toggleDay: (day: number) => void
}

export function DayGrid({ doneDays, toggleDay }: Props) {
  return (
    <div className="grid grid-cols-5 gap-3 sm:grid-cols-10">
      {Array.from({ length: 100 }, (_, i) => {
        const day = i + 1
        const done = doneDays.includes(day)

        return (
          <button
            key={day}
            onClick={() => toggleDay(day)}
            className={`
              rounded-xl p-3 text-sm font-medium transition
              ${done 
                ? "bg-green-500 text-white" 
                : "bg-gray-100 hover:bg-gray-200"}
            `}
          >
            {day}
          </button>
        )
      })}
    </div>
  )
}
