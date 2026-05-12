import Link from "next/link";
import {
  LayoutDashboard,
  ArrowRightLeft,
  FileText,
  Target,
  MessageCircle,
  Moon,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Wallet,
} from "lucide-react";

const features = [
  {
    icon: LayoutDashboard,
    title: "Dashboard inteligente",
    description: "Visualize receitas, despesas e saldo em cards e gráficos atualizados em tempo real.",
    color: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  {
    icon: ArrowRightLeft,
    title: "Controle de transações",
    description: "Adicione, edite e filtre transações por mês e categoria com busca instantânea.",
    color: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  {
    icon: Target,
    title: "Metas de orçamento",
    description: "Defina limites mensais por categoria e acompanhe o progresso com barras visuais.",
    color: "bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400",
  },
  {
    icon: FileText,
    title: "Relatórios em PDF e Excel",
    description: "Exporte o resumo de qualquer mês com um clique, pronto para imprimir ou analisar.",
    color: "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400",
  },
  {
    icon: MessageCircle,
    title: "Lançamento por WhatsApp",
    description: "Registre gastos enviando uma mensagem como \"50 mercado\" direto pelo WhatsApp.",
    color: "bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400",
  },
  {
    icon: Moon,
    title: "Dark mode",
    description: "Interface adaptada para uso noturno. Seu conforto visual em qualquer horário.",
    color: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">

      {/* Navbar */}
      <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-xl font-bold text-emerald-500 tracking-tight">Moneyzin</span>
          <div className="flex items-center gap-3">
            <Link
              href="/sign-in"
              className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 transition-colors px-4 py-2"
            >
              Entrar
            </Link>
            <Link
              href="/sign-up"
              className="text-sm font-medium bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl transition-colors shadow-sm"
            >
              Começar grátis
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="pt-32 pb-20 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-full mb-6 tracking-wide uppercase">
              ✦ Controle financeiro pessoal
            </span>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight tracking-tight mb-6">
              Suas finanças,{" "}
              <span className="text-emerald-500">simplificadas.</span>
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto mb-10 leading-relaxed">
              Registre gastos, acompanhe receitas e visualize para onde vai seu dinheiro — tudo em um só lugar, de forma rápida e visual.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/sign-up"
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-7 py-3.5 rounded-xl font-semibold transition-colors shadow-md shadow-emerald-500/20 w-full sm:w-auto justify-center"
              >
                Começar grátis <ArrowRight size={18} />
              </Link>
              <Link
                href="/sign-in"
                className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-7 py-3.5 rounded-xl font-medium border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors w-full sm:w-auto justify-center"
              >
                Já tenho conta
              </Link>
            </div>
          </div>
        </section>

        {/* Dashboard preview */}
        <section className="px-6 pb-24">
          <div className="max-w-5xl mx-auto">
            <div className="bg-gray-50 dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-6 shadow-2xl shadow-gray-200/50 dark:shadow-black/30">

              {/* Fake top bar */}
              <div className="flex items-center gap-2 mb-5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <div className="ml-4 flex-1 h-6 bg-gray-100 dark:bg-gray-800 rounded-lg max-w-xs text-[10px] text-gray-400 dark:text-gray-600 flex items-center px-3">
                  moneyzin.vercel.app/dashboard
                </div>
              </div>

              {/* Summary cards */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { label: "Saldo", value: "R$ 1.800,00", icon: Wallet, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
                  { label: "Receitas", value: "R$ 5.000,00", icon: TrendingUp, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10" },
                  { label: "Despesas", value: "R$ 3.200,00", icon: TrendingDown, color: "text-red-500", bg: "bg-red-50 dark:bg-red-500/10" },
                ].map((card) => (
                  <div key={card.label} className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">{card.label}</span>
                      <span className={`p-1.5 rounded-lg ${card.bg}`}>
                        <card.icon size={14} className={card.color} />
                      </span>
                    </div>
                    <p className="text-base font-bold text-gray-800 dark:text-gray-100">{card.value}</p>
                    <p className="text-[10px] text-gray-400 dark:text-gray-600 mt-1">Maio 2026</p>
                  </div>
                ))}
              </div>

              {/* Budget progress bars */}
              <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800 p-4">
                <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-3">Metas do mês</p>
                <div className="space-y-2.5">
                  {[
                    { label: "Alimentação", pct: 64, spent: "R$ 320", limit: "R$ 500", color: "bg-emerald-500" },
                    { label: "Transporte", pct: 90, spent: "R$ 180", limit: "R$ 200", color: "bg-amber-400" },
                    { label: "Lazer", pct: 110, spent: "R$ 220", limit: "R$ 200", color: "bg-red-500" },
                  ].map((b) => (
                    <div key={b.label}>
                      <div className="flex justify-between text-[10px] text-gray-500 dark:text-gray-400 mb-1">
                        <span>{b.label}</span>
                        <span>{b.spent} / {b.limit}</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${b.color}`} style={{ width: `${Math.min(b.pct, 100)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="px-6 pb-24 bg-gray-50 dark:bg-gray-900/50 py-20">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                Tudo o que você precisa
              </h2>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                Funcionalidades pensadas para quem quer controlar dinheiro de forma prática, sem complicação.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  <span className={`inline-flex p-2.5 rounded-xl mb-4 ${f.color}`}>
                    <f.icon size={20} />
                  </span>
                  <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="px-6 py-24">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Comece a controlar seu dinheiro hoje
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">
              Gratuito, sem cartão de crédito. Crie sua conta em segundos.
            </p>
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-xl font-semibold transition-colors shadow-md shadow-emerald-500/20 text-lg"
            >
              Criar conta grátis <ArrowRight size={20} />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 dark:border-gray-800 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-lg font-bold text-emerald-500">Moneyzin</span>
          <p className="text-sm text-gray-400 dark:text-gray-600">
            © 2026 Moneyzin. Feito com Next.js, Prisma e Tailwind CSS.
          </p>
        </div>
      </footer>

    </div>
  );
}
