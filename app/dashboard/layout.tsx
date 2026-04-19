"use client";

import { UserButton } from "@clerk/nextjs";
import { LayoutDashboard, ArrowRightLeft, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { VisibilityProvider } from "../contexts/VisibilityContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      
      {/* 1. Menu Lateral (Desktop - Some no celular) */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col hidden md:flex z-10">
        <div className="p-6 border-b border-gray-100">
          <span className="text-2xl font-bold text-emerald-500 tracking-tight">Moneyzin</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 mt-4">
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

          <Link 
            href="#" 
            className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-700 rounded-xl font-medium transition-colors"
          >
            <Settings size={20} />
            Configurações
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-100 m-4 rounded-xl bg-gray-50 flex items-center justify-center">
          <UserButton showName />
        </div>
      </aside>

      {/* 2. Conteúdo Principal (Adicionado pb-20 no mobile para não amassar conteúdo embaixo do menu) */}
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0 relative">
        <VisibilityProvider>
          {children}
        </VisibilityProvider>
      </main>

      {/* 3. A MÁGICA: Menu Inferior Estilo App (Só aparece no Celular) */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-gray-200 flex items-center justify-around p-3 z-50 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)]">
        
        <Link 
          href="/dashboard" 
          className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${
            pathname === "/dashboard" ? "text-emerald-600" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <LayoutDashboard size={20} />
          <span className="text-[10px] font-medium">Início</span>
        </Link>
        
        <Link 
          href="/dashboard/transactions" 
          className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${
            pathname === "/dashboard/transactions" ? "text-emerald-600" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <ArrowRightLeft size={20} />
          <span className="text-[10px] font-medium">Transações</span>
        </Link>

        {/* Atalho de Perfil do Clerk no lugar de "Configurações" por enquanto */}
        <div className="flex flex-col items-center gap-1 p-2 mt-1">
            <UserButton />
            <span className="text-[10px] font-medium text-gray-400">Perfil</span>
        </div>
      </nav>

    </div>
  );
}