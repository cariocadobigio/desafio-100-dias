"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/Header"
import { DayGrid } from "@/components/DayGrid"
import { ProgressCard } from "@/components/ProgressCard"
import { getTotal } from "@/lib/challenge"

export default function Home() {
  const [doneDays, setDoneDays] = useState<number[]>([])

  useEffect(() => {
    const saved = localStorage.getItem("doneDays")
    if (saved) setDoneDays(JSON.parse(saved))
  }, [])

  function toggleDay(day: number) {
    setDoneDays(prev => {
      const updated = prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]

      localStorage.setItem("doneDays", JSON.stringify(updated))
      return updated
    })
  }
  
  const total = getTotal(doneDays)
  const progress = (doneDays.length / 100) * 100

  return (
    <main className="min-h-screen bg-gray-50 p-6 space-y-8">
      <Header />

      <ProgressCard total={total} progress={progress} />

      <DayGrid doneDays={doneDays} toggleDay={toggleDay} />
    </main>
  )
}
