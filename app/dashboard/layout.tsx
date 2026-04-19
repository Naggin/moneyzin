"use client"; // Precisamos disso para o Next.js saber ler a rota atual no navegador

import { UserButton } from "@clerk/nextjs";
import { LayoutDashboard, ArrowRightLeft, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname(); // O nosso "radar" de páginas

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Menu Lateral (Sidebar) */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-gray-100">
          <span className="text-2xl font-bold text-emerald-500 tracking-tight">Moneyzin</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 mt-4">
          {/* Link Visão Geral */}
          <Link 
            href="/dashboard" 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
              pathname === "/dashboard" 
                ? "bg-emerald-50 text-emerald-600" 
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
            }`}
          >
            <LayoutDashboard size={20} />
            Visão Geral
          </Link>
          
          {/* Link Transações (AGORA COM O ENDEREÇO CERTO) */}
          <Link 
            href="/dashboard/transactions" 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
              pathname === "/dashboard/transactions" 
                ? "bg-emerald-50 text-emerald-600" 
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
            }`}
          >
            <ArrowRightLeft size={20} />
            Transações
          </Link>

          {/* Link Configurações (Ainda vazio, para o futuro) */}
          <Link 
            href="#" 
            className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-700 rounded-xl font-medium transition-colors"
          >
            <Settings size={20} />
            Configurações
          </Link>
        </nav>

        {/* Rodapé da Sidebar com Botão do Clerk */}
        <div className="p-4 border-t border-gray-100 m-4 rounded-xl bg-gray-50 flex items-center justify-center">
          <UserButton showName />
        </div>
      </aside>

      {/* Conteúdo Principal (Onde as páginas vão renderizar) */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}