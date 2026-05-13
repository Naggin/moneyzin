import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col items-center justify-center px-6 text-center">
      <div className="mb-8">
        <span className="text-8xl font-bold text-emerald-500 tracking-tight leading-none">404</span>
      </div>

      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
        Página não encontrada
      </h1>
      <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-10 leading-relaxed">
        O endereço que você tentou acessar não existe ou foi movido.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Link
          href="/"
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors shadow-sm w-full sm:w-auto justify-center"
        >
          <Home size={18} />
          Ir para a home
        </Link>
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-6 py-3 rounded-xl font-medium border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors w-full sm:w-auto justify-center"
        >
          <ArrowLeft size={18} />
          Voltar ao dashboard
        </Link>
      </div>

      <div className="mt-16">
        <span className="text-lg font-bold text-emerald-500 tracking-tight">Moneyzin</span>
      </div>
    </div>
  );
}
