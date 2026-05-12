"use client";

import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { Search, X } from "lucide-react";
import { CATEGORIES } from "../lib/schemas";

interface Props {
  month: number;
  year: number;
  initialSearch: string;
  initialCategory: string;
}

export default function TransactionFilters({ month, year, initialSearch, initialCategory }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const push = (s: string, c: string) => {
    const params = new URLSearchParams();
    params.set("month", String(month));
    params.set("year", String(year));
    params.set("page", "1");
    if (s) params.set("search", s);
    if (c) params.set("category", c);
    router.push(`?${params.toString()}`);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => push(value, category), 350);
  };

  const handleCategory = (value: string) => {
    setCategory(value);
    clearTimeout(debounceRef.current);
    push(search, value);
  };

  const hasFilters = search || category;

  const clearAll = () => {
    setSearch("");
    setCategory("");
    push("", "");
  };

  return (
    <div className="flex flex-wrap items-center gap-3 p-4 border-b border-gray-50 dark:border-gray-800">
      <div className="relative flex-1 min-w-48">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none" />
        <input
          type="text"
          placeholder="Buscar por descrição..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600 transition-shadow"
        />
      </div>

      <select
        value={category}
        onChange={(e) => handleCategory(e.target.value)}
        className="text-sm bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500 dark:text-gray-100 transition-shadow"
      >
        <option value="">Todas as categorias</option>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      {hasFilters && (
        <button
          onClick={clearAll}
          className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <X size={14} /> Limpar
        </button>
      )}
    </div>
  );
}
