import { Github, Linkedin } from "lucide-react"

export function Footer() {
  return (
    <footer className="py-8 text-center text-sm text-neutral-400 border-t border-neutral-200 mt-10">
      <p className="mb-2">
        Desenvolvido por <span className="font-semibold text-neutral-600">Rodrigo Borges</span>
      </p>
      <div className="flex justify-center gap-4">
        <a 
          href="https://github.com/cariocadobigio" 
          target="_blank" 
          rel="noreferrer"
          className="hover:text-emerald-600 transition-colors"
        >
          <Github size={20} />
        </a>
        <a 
          href="#" 
          className="hover:text-blue-600 transition-colors"
        >
          <Linkedin size={20} />
        </a>
      </div>
      <p className="mt-4 text-xs">
        &copy; {new Date().getFullYear()} Carioca do Bugio. Todos os direitos reservados.
      </p>
    </footer>
  )
}