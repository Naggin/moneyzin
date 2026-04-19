"use client";

import { TrendingUp, TrendingDown, Wallet, Eye, EyeOff } from "lucide-react";
import { useVisibility } from "../contexts/VisibilityContext";

interface SummaryProps {
  balance: number;
  incomes: number;
  expenses: number;
}

export default function SummaryCards({ balance, incomes, expenses }: SummaryProps) {
  const { isVisible, toggleVisibility } = useVisibility();

  const formatCurrency = (value: number) => {
    if (!isVisible) return "R$ •••••";
    
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="mb-8">
      {/* Botão do Olhinho */}
      <div className="flex justify-end mb-4">
        <button
          onClick={toggleVisibility}
          className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium text-sm bg-white dark:bg-gray-900 px-4 py-2 rounded-full shadow-sm border border-gray-100 dark:border-gray-800"
        >
          {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
          {isVisible ? "Ocultar valores" : "Mostrar valores"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm transition-all duration-300">
          <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 mb-2">
            <Wallet size={20} />
            <span className="text-sm font-medium">Saldo Total</span>
          </div>
          <p className={`text-2xl font-bold transition-all ${!isVisible ? 'text-gray-400 dark:text-gray-600' : balance >= 0 ? 'text-gray-800 dark:text-gray-100' : 'text-red-600 dark:text-red-500'}`}>
            {formatCurrency(balance)}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm transition-all duration-300">
          <div className="flex items-center gap-3 text-emerald-500 mb-2">
            <TrendingUp size={20} />
            <span className="text-sm font-medium">Receitas</span>
          </div>
          <p className={`text-2xl font-bold transition-all ${!isVisible ? 'text-gray-400 dark:text-gray-600' : 'text-gray-800 dark:text-gray-100'}`}>
            {formatCurrency(incomes)}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm transition-all duration-300">
          <div className="flex items-center gap-3 text-red-500 mb-2">
            <TrendingDown size={20} />
            <span className="text-sm font-medium">Despesas</span>
          </div>
          <p className={`text-2xl font-bold transition-all ${!isVisible ? 'text-gray-400 dark:text-gray-600' : 'text-gray-800 dark:text-gray-100'}`}>
            {formatCurrency(expenses)}
          </p>
        </div>
      </div>
    </div>
  );
}