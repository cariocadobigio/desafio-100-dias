export type ChallengeProgress = {
  uid: string
  doneDays: number[] // 1..100
  updatedAt: number // epoch ms
}

export type ToggleDayInput = {
  day: number
}
