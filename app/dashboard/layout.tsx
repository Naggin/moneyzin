"use client";

import { UserButton } from "@clerk/nextjs";
import { LayoutDashboard, ArrowRightLeft, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { VisibilityProvider } from "../contexts/VisibilityContext";
import { ThemeProvider } from "../providers/ThemeProvider"; // O Motor de luz
import ThemeToggle from "../components/ThemeToggle"; // O Interruptor

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <ThemeProvider>
      <VisibilityProvider>
        {/* Adicionado dark:bg-gray-900 para o fundo principal ficar escuro */}
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 overflow-hidden">
          
          {/* Menu Lateral (Desktop) */}
          <aside className="w-64 bg-white dark:bg-gray-950 border-r border-gray-100 dark:border-gray-800 flex flex-col hidden md:flex z-10 transition-colors duration-300">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800">
              <span className="text-2xl font-bold text-emerald-500 tracking-tight">Moneyzin</span>
            </div>
            
            <nav className="flex-1 p-4 space-y-2 mt-4">
              <Link href="/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${pathname === "/dashboard" ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"}`}>
                <LayoutDashboard size={20} />
                Visão Geral
              </Link>
              
              <Link href="/dashboard/transactions" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${pathname === "/dashboard/transactions" ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"}`}>
                <ArrowRightLeft size={20} />
                Transações
              </Link>

              <Link href="#" className="flex items-center gap-3 px-4 py-3 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl font-medium transition-colors">
                <Settings size={20} />
                Configurações
              </Link>

              {/* Botão de Tema no Menu Desktop */}
              <ThemeToggle />
            </nav>

            <div className="p-4 border-t border-gray-100 dark:border-gray-800 m-4 rounded-xl bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors">
              <UserButton showName />
            </div>
          </aside>

          {/* Conteúdo Principal */}
          <main className="flex-1 overflow-y-auto pb-20 md:pb-0 relative">
            {children}
          </main>

          {/* Menu Inferior (Mobile) */}
          <nav className="md:hidden fixed bottom-0 w-full bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 flex items-center justify-around p-3 z-50 transition-colors duration-300">
            <Link href="/dashboard" className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${pathname === "/dashboard" ? "text-emerald-600 dark:text-emerald-400" : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"}`}>
              <LayoutDashboard size={20} />
              <span className="text-[10px] font-medium">Início</span>
            </Link>
            
            <Link href="/dashboard/transactions" className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${pathname === "/dashboard/transactions" ? "text-emerald-600 dark:text-emerald-400" : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"}`}>
              <ArrowRightLeft size={20} />
              <span className="text-[10px] font-medium">Transações</span>
            </Link>

            {/* Botão de Tema no Menu Mobile */}
            <ThemeToggle />

            <div className="flex flex-col items-center gap-1 p-2 mt-1">
                <UserButton />
                <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500">Perfil</span>
            </div>
          </nav>

        </div>
      </VisibilityProvider>
    </ThemeProvider>
  );
}