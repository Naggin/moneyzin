"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

export default function MonthNavigator({ month, year }: { month: number; year: number }) {
  const prev = month === 1 ? { month: 12, year: year - 1 } : { month: month - 1, year };
  const next = month === 12 ? { month: 1, year: year + 1 } : { month: month + 1, year };

  return (
    <div className="flex items-center gap-1 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl px-2 py-1.5 shadow-sm">
      <Link
        href={`?month=${prev.month}&year=${prev.year}`}
        className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <ChevronLeft size={16} />
      </Link>
      <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 min-w-[130px] text-center">
        {MONTHS[month - 1]} {year}
      </span>
      <Link
        href={`?month=${next.month}&year=${next.year}`}
        className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <ChevronRight size={16} />
      </Link>
    </div>
  );
}
