"use client"

import { useState } from "react"
import { Github, Linkedin, Coffee, X, Copy, Check } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function Footer() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  
  const PIX_KEY = "claudesonborges@gmail.com"
  // API pública segura para gerar o QR Code visual da chave
  const QR_CODE_URL = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${PIX_KEY}`

  const handleCopy = () => {
    navigator.clipboard.writeText(PIX_KEY)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <footer className="py-8 text-center text-sm text-neutral-400 border-t border-neutral-200 mt-10">
        <p className="mb-4">
          Desenvolvido por <span className="font-semibold text-neutral-600">Rodrigo Borges</span>
        </p>
        
        <div className="flex flex-col items-center gap-4">
          {/* Redes Sociais */}
          <div className="flex justify-center gap-4">
            <a 
              href="https://github.com/ClaudesonRodrigo" 
              target="_blank" 
              rel="noreferrer"
              className="hover:text-emerald-600 transition-colors"
            >
              <Github size={20} />
            </a>
            <a 
              href="https://instagram.com/rodrigoborges_ofc" 
              className="hover:text-blue-600 transition-colors"
            >
              <Linkedin size={20} />
            </a>
          </div>

          {/* Botão do Cafezinho */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="group flex items-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-emerald-50 text-neutral-600 hover:text-emerald-700 rounded-full transition-all border border-transparent hover:border-emerald-200 text-xs font-medium"
          >
            <Coffee size={16} className="group-hover:-translate-y-0.5 transition-transform" />
            Pagar um café ao Dev
          </button>
        </div>

        <p className="mt-6 text-[10px] text-neutral-300">
          &copy; {new Date().getFullYear()} Carioca do Bugio. Todos os direitos reservados.
        </p>
      </footer>

      {/* MODAL DO PIX */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Fundo Escuro com Blur */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm"
            />

            {/* Cartão do Pix */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl overflow-hidden"
            >
              {/* Botão Fechar */}
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 p-1 rounded-full transition-colors"
              >
                <X size={20} />
              </button>

              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full mb-2">
                  <Coffee size={24} />
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-neutral-800">Gostou do App?</h3>
                  <p className="text-sm text-neutral-500">Ajude a manter o projeto no ar!</p>
                </div>

                {/* Área do QR Code */}
                <div className="bg-white p-2 border border-neutral-200 rounded-xl inline-block shadow-inner">
                  {/* Usa a API para gerar o QR Code da chave Pix */}
                  <img 
                    src={QR_CODE_URL} 
                    alt="QR Code Pix" 
                    className="w-48 h-48 object-contain mix-blend-multiply opacity-90"
                  />
                </div>

                {/* Área de Copiar */}
                <div className="space-y-2">
                  <p className="text-xs font-bold text-neutral-400 uppercase tracking-wide">Chave Pix (E-mail)</p>
                  <div className="flex items-center gap-2 bg-neutral-50 border border-neutral-200 p-2 rounded-lg">
                    <code className="flex-1 text-xs text-neutral-600 font-mono truncate text-left pl-2">
                      {PIX_KEY}
                    </code>
                    <button
                      onClick={handleCopy}
                      className={`p-2 rounded-md transition-all ${
                        copied 
                          ? "bg-emerald-500 text-white" 
                          : "bg-white text-neutral-500 hover:text-emerald-600 border border-neutral-200 hover:border-emerald-300"
                      }`}
                    >
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}