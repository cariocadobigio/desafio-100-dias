"use client"

import { useActionState } from "react"
import { signInWithPopup } from "firebase/auth"
import { auth, googleProvider } from "@/lib/firebase-client"
import { createSessionAction, type ActionResult } from "@/app/actions/auth"

const initialState: ActionResult = { success: false, message: "" }

export default function LoginButton() {
  const [state, formAction, pending] = useActionState(createSessionAction, initialState)

  async function handleGoogleLogin() {
    const cred = await signInWithPopup(auth, googleProvider)
    const idToken = await cred.user.getIdToken()

    const fd = new FormData()
    fd.set("idToken", idToken)
    formAction(fd)
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={pending}
        className="w-full rounded-xl bg-black px-4 py-3 text-white font-semibold hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Conectando..." : "Entrar com Google"}
      </button>

      {state.message && (
        <p className={["text-sm", state.success ? "text-emerald-600" : "text-red-600"].join(" ")}>
          {state.message}
        </p>
      )}
    </div>
  )
}

