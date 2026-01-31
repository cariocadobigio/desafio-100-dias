import type { Metadata, Viewport } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Desafio 100 Dias",
  description: "Quem economiza, realiza.",
  manifest: "/manifest.json", // Link para o manifesto
}

export const viewport: Viewport = {
  themeColor: "#10b981", // Cor da barra de status no mobile
  width: "device-width",
  initialScale: 1,
  maximumScale: 1, // Evita zoom acidental ao tocar botões
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased bg-gray-50 text-gray-900">
        {children}
      </body>
    </html>
  )
}