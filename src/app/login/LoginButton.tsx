"use client"

import { useEffect } from "react"
import { useActionState } from "react"
import { useRouter } from "next/navigation"
import { signInWithPopup } from "firebase/auth"

import { auth, googleProvider } from "@/lib/firebase-client"
import { createSessionAction, type ActionResult } from "@/app/actions/auth"

const initialState: ActionResult = { success: false, message: "" }

export default function LoginButton() {
  const router = useRouter()
  const [state, formAction, pending] = useActionState(createSessionAction, initialState)

  useEffect(() => {
    if (state.success) router.push("/dashboard")
  }, [state.success, router])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const cred = await signInWithPopup(auth, googleProvider)
    const idToken = await cred.user.getIdToken(true)

    const fd = new FormData()
    fd.set("idToken", idToken)

    // ✅ chama como action de formulário (sem warning)
    formAction(fd)
  }

  return (
    <form action={formAction} onSubmit={onSubmit} className="space-y-3">
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-black px-4 py-3 text-white font-semibold hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Conectando..." : "Entrar com Google"}
      </button>

      {!!state.message && (
        <p className={["text-sm", state.success ? "text-emerald-600" : "text-red-600"].join(" ")}>
          {state.message}
        </p>
      )}
    </form>
  )
}
