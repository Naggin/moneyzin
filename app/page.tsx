import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <h1 className="text-4xl font-bold text-emerald-500 mb-4">Moneyzin</h1>
      <p className="text-gray-500 mb-8">Seu controle financeiro minimalista.</p>
      <Link 
        href="/dashboard" 
        className="px-6 py-3 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors shadow-sm"
      >
        Acessar Dashboard
      </Link>
    </div>
  );
}