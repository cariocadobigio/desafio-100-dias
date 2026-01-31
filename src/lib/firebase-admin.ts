import "server-only"
import { cert, getApps, initializeApp } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"

function getPrivateKey() {
  const key = process.env.FIREBASE_ADMIN_PRIVATE_KEY
  if (!key) throw new Error("Missing FIREBASE_ADMIN_PRIVATE_KEY")
  return key.replace(/\\n/g, "\n")
}

export const adminApp =
  getApps().length > 0
    ? getApps()[0]!
    : initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_ADMIN_PROJECT_ID!,
          clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL!,
          privateKey: getPrivateKey(),
        }),
      })

export const adminAuth = getAuth(adminApp)
export const adminDb = getFirestore(adminApp)
