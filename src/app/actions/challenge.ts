"use server"

import { z } from "zod"
import { adminDb } from "@/lib/firebase-admin"
import { getSessionUid } from "@/lib/session"
import { revalidatePath } from "next/cache"
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

    await adminDb.runTransaction(async (tx) => {
      const ref = progressDocRef(uid)
      const snap = await tx.get(ref)

      const current = snap.exists ? (snap.data() as { doneDays?: number[] }).doneDays ?? [] : []
      const has = current.includes(day)
      const next = has ? current.filter((d) => d !== day) : [...current, day].sort((a, b) => a - b)

      tx.set(ref, { uid, doneDays: next, updatedAt: Date.now() }, { merge: true })
    })

    revalidatePath("/dashboard")
    return { success: true, message: "Progresso atualizado." }
  } catch {
    return { success: false, message: "Falha ao atualizar progresso." }
  }
}

export async function resetProgressAction(): Promise<ActionResult> {
  try {
    const uid = await getSessionUid()
    if (!uid) return { success: false, message: "Não autenticado." }

    const ref = adminDb.doc(`users/${uid}/challenge/progress`)
    
    await ref.set({ uid, doneDays: [], updatedAt: Date.now() }, { merge: true })

    revalidatePath("/dashboard")
    return { success: true, message: "Progresso resetado com sucesso." }
  } catch {
    return { success: false, message: "Erro ao resetar progresso." }
  }
}