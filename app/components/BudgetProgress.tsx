"use client";

import { Target } from "lucide-react";
import Link from "next/link";

interface BudgetItem {
  category: string;
  limit: number;
  spent: number;
}

interface Props {
  items: BudgetItem[];
  month: number;
  year: number;
}

const formatCurrency = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

export default function BudgetProgress({ items, month, year }: Props) {
  if (items.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 transition-colors duration-300">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-purple-50 dark:bg-purple-500/10 rounded-lg text-purple-600 dark:text-purple-400">
              <Target size={16} />
            </span>
            <h2 className="font-bold text-gray-800 dark:text-gray-100">Metas do mês</h2>
          </div>
        </div>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-3">
          Nenhuma meta definida.{" "}
          <Link href="/dashboard/metas" className="text-emerald-500 hover:underline">
            Configurar metas
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 transition-colors duration-300">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <span className="p-2 bg-purple-50 dark:bg-purple-500/10 rounded-lg text-purple-600 dark:text-purple-400">
            <Target size={16} />
          </span>
          <div>
            <h2 className="font-bold text-gray-800 dark:text-gray-100">Metas do mês</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Progresso por categoria</p>
          </div>
        </div>
        <Link
          href="/dashboard/metas"
          className="text-xs text-gray-400 dark:text-gray-500 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
        >
          Editar metas
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => {
          const pct = item.limit > 0 ? (item.spent / item.limit) * 100 : 0;
          const over = pct > 100;
          const warning = pct >= 80 && !over;
          const barColor = over ? "bg-red-500" : warning ? "bg-amber-400" : "bg-emerald-500";
          const textColor = over ? "text-red-500 dark:text-red-400" : warning ? "text-amber-500 dark:text-amber-400" : "text-emerald-500 dark:text-emerald-400";

          return (
            <div key={item.category} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.category}</span>
                <span className={`text-xs font-bold ${textColor}`}>
                  {Math.round(pct)}%
                </span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-2">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                  style={{ width: `${Math.min(pct, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-gray-400 dark:text-gray-500">
                <span>{formatCurrency(item.spent)}</span>
                <span>/ {formatCurrency(item.limit)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
