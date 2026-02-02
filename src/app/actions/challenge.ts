"use server"

import { z } from "zod"
import { adminDb } from "@/lib/firebase-admin"
import { getSessionUid } from "@/lib/session"
import { revalidatePath } from "next/cache"
import type { ActionResult } from "./auth"

const ToggleSchema = z.object({
  day: z.number().int().min(1).max(100),
})

const GoalSchema = z.object({
  title: z.string().min(1, "O objetivo não pode estar vazio.").max(40, "O nome do objetivo é muito longo."),
  totalDays: z.coerce.number().int().min(10).max(100),
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

    const ref = progressDocRef(uid)
    await ref.set({ uid, doneDays: [], updatedAt: Date.now() }, { merge: true })

    revalidatePath("/dashboard")
    return { success: true, message: "Progresso resetado." }
  } catch {
    return { success: false, message: "Erro ao resetar." }
  }
}

export async function saveGoalAction(formData: FormData): Promise<ActionResult> {
  try {
    const uid = await getSessionUid()
    if (!uid) return { success: false, message: "Não autenticado." }

    const rawData = {
      title: formData.get("title"),
      totalDays: formData.get("totalDays"),
    }

    const parsed = GoalSchema.safeParse(rawData)

    if (!parsed.success) {
      // CORREÇÃO: Usamos .issues em vez de .errors
      const errorMessage = parsed.error.issues[0]?.message ?? "Dados inválidos."
      return { success: false, message: errorMessage }
    }

    const ref = progressDocRef(uid)
    await ref.set({ 
      goal: parsed.data.title, 
      totalDays: parsed.data.totalDays,
      updatedAt: Date.now() 
    }, { merge: true })

    revalidatePath("/dashboard")
    return { success: true, message: "Objetivo definido com sucesso!" }
  } catch {
    return { success: false, message: "Erro ao salvar objetivo." }
  }
}