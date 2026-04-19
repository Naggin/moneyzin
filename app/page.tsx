import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <h1 className="text-4xl font-bold text-emerald-500 dark:text-emerald-400 mb-4">Moneyzin</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8 transition-colors">Seu controle financeiro minimalista.</p>
      <Link 
        href="/dashboard" 
        className="px-6 py-3 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 dark:hover:bg-emerald-500 transition-colors shadow-sm"
      >
        Acessar Dashboard
      </Link>
    </div>
  );
}