import Link from "next/link"
import { Footer } from "@/components/Footer"
import { ArrowRight, PiggyBank, Target, TrendingUp, ShieldCheck } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navbar Simples */}
      <nav className="p-6 flex justify-between items-center max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-100 p-2 rounded-lg">
            <TrendingUp className="text-emerald-600" size={24} />
          </div>
          <span className="font-bold text-xl tracking-tight text-neutral-900">Desafio 100 Dias</span>
        </div>
        <Link 
          href="/login"
          className="text-sm font-semibold text-neutral-600 hover:text-emerald-600 transition-colors"
        >
          Entrar
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="pt-12 pb-20 px-6 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            O método viral de economia
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-neutral-900 tracking-tight mb-6">
            Junte <span className="text-emerald-600">R$ 5.050</span> em apenas 3 meses.
          </h1>
          
          <p className="text-lg md:text-xl text-neutral-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            Sem planilhas complexas. Sem taxas. Apenas um desafio divertido para transformar pequenas quantias numa grande realização.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/login"
              className="w-full sm:w-auto px-8 py-4 bg-emerald-600 text-white rounded-xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 group"
            >
              Começar Desafio Grátis
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/login"
              className="w-full sm:w-auto px-8 py-4 bg-white text-neutral-700 border border-neutral-200 rounded-xl font-bold text-lg hover:bg-neutral-50 transition-all flex items-center justify-center"
            >
              Já tenho conta
            </Link>
          </div>
        </section>

        {/* Como Funciona */}
        <section className="bg-neutral-50 py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-neutral-800">Como funciona a mágica?</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Passo 1 */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100 text-center hover:shadow-md transition-shadow">
                <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-600">
                  <Target size={32} />
                </div>
                <h3 className="text-xl font-bold mb-3">1. Escolha um número</h3>
                <p className="text-neutral-500">
                  Todos os dias, escolha um número de 1 a 100 na nossa tabela interativa.
                </p>
              </div>

              {/* Passo 2 */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100 text-center hover:shadow-md transition-shadow">
                <div className="bg-emerald-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-emerald-600">
                  <PiggyBank size={32} />
                </div>
                <h3 className="text-xl font-bold mb-3">2. Guarde o valor</h3>
                <p className="text-neutral-500">
                  Economize o valor correspondente. Pode ser no Pix, no cofrinho ou numa conta digital.
                </p>
              </div>

              {/* Passo 3 */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100 text-center hover:shadow-md transition-shadow">
                <div className="bg-purple-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-purple-600">
                  <ShieldCheck size={32} />
                </div>
                <h3 className="text-xl font-bold mb-3">3. Marque e Celebre</h3>
                <p className="text-neutral-500">
                  Marque o dia como concluído no app. O seu progresso fica salvo na nuvem para sempre.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Estatísticas / Prova Lógica */}
        <section className="py-20 px-6 max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">A Matemática do Sucesso</h2>
          <div className="bg-neutral-900 text-white p-8 md:p-12 rounded-3xl shadow-2xl relative overflow-hidden">
            {/* Elemento decorativo de fundo */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-emerald-500 rounded-full opacity-20 blur-3xl"></div>
            
            <div className="relative z-10">
              <p className="text-neutral-400 text-lg mb-2">Resultado Final</p>
              <div className="text-5xl md:text-7xl font-bold text-emerald-400 mb-6">
                R$ 5.050,00
              </div>
              <p className="text-lg text-neutral-300 max-w-lg mx-auto">
                Ao completar a tabela de 1 a 100, você terá acumulado exatamente este valor. O segredo é a constância!
              </p>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="pb-20 px-6 text-center">
          <p className="text-neutral-500 mb-6 font-medium">Junte-se a quem já está realizando sonhos.</p>
          <Link 
            href="/login"
            className="inline-flex items-center justify-center px-8 py-4 bg-neutral-900 text-white rounded-xl font-bold text-lg hover:bg-neutral-800 transition-all hover:scale-105"
          >
            Criar Minha Conta Agora
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  )
}