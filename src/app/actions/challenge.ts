"use server"

import { z } from "zod"
import { adminDb } from "@/lib/firebase-admin"
import { getSessionUid } from "@/lib/session"
import type { ActionResult } from "./auth"

const ToggleSchema = z.object({
  day: z.number().int().min(1).max(100),
})

function progressDocRef(uid: string) {
  return adminDb.doc(`users/${uid}/challenge/progress`)
}

export async function toggleDayAction(input: { day: number }): Promise<ActionResult> {
  try {
    const uid = await getSessionUid()
    if (!uid) return { success: false, message: "Não autenticado." }

    const parsed = ToggleSchema.safeParse(input)
    if (!parsed.success) return { success: false, message: "Dia inválido." }

    const { day } = parsed.data

    await adminDb.runTransaction(async (tx: { get: (arg0: any) => any; set: (arg0: any, arg1: { uid: string; doneDays: number[]; updatedAt: number }, arg2: { merge: boolean }) => void }) => {
      const ref = progressDocRef(uid)
      const snap = await tx.get(ref)

      const current = snap.exists ? (snap.data() as { doneDays?: number[] }).doneDays ?? [] : []
      const has = current.includes(day)
      const next = has ? current.filter((d) => d !== day) : [...current, day].sort((a, b) => a - b)

      tx.set(ref, { uid, doneDays: next, updatedAt: Date.now() }, { merge: true })
    })

    return { success: true, message: "Progresso atualizado." }
  } catch {
    return { success: false, message: "Falha ao atualizar progresso." }
  }
}
