import { getSessionUid } from "@/lib/session"
import { redirect } from "next/navigation"

export const runtime = "nodejs"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const uid = await getSessionUid()
  if (!uid) redirect("/login")

  const masterUid = process.env.ADMIN_MASTER_UID
  if (!masterUid || uid !== masterUid) redirect("/dashboard")

  return <>{children}</>
}
