export const DAYS = Array.from({ length: 100 }, (_, i) => i + 1)

export function getTotal(doneDays: number[]) {
  return doneDays.reduce((sum, day) => sum + day, 0)
}

export function getProgress(doneDays: number[]) {
  return (doneDays.length / 100) * 100
}

export function getDayValue(day: number) {
  return day
}
