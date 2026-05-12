"use client";

import { useState } from "react";
import { upsertBudget } from "../lib/actions";
import { CATEGORIES, type Category } from "../lib/schemas";
import { toast } from "sonner";
import { Target } from "lucide-react";

const EXPENSE_CATEGORIES = CATEGORIES.filter((c) => c !== "Salário");

interface Props {
  budgets: Record<string, number>;
}

export default function BudgetSettings({ budgets }: Props) {
  const [values, setValues] = useState<Record<string, string>>(
    () => Object.fromEntries(EXPENSE_CATEGORIES.map((c) => [c, budgets[c] ? String(budgets[c]) : ""]))
  );

  async function handleSave(category: Category) {
    const raw = values[category] ?? "";
    const amount = raw === "" ? 0 : parseFloat(raw.replace(",", "."));
    if (isNaN(amount) || amount < 0) {
      toast.error("Valor inválido");
      return;
    }
    const fd = new FormData();
    fd.set("category", category);
    fd.set("amount", String(amount));
    try {
      await upsertBudget(fd);
      toast.success(amount === 0 ? `Meta de ${category} removida.` : `Meta de ${category} salva!`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao salvar");
    }
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 transition-colors duration-300">
      <div className="flex items-center gap-3 mb-2">
        <span className="p-2 bg-purple-50 dark:bg-purple-500/10 rounded-lg text-purple-600 dark:text-purple-400">
          <Target size={18} />
        </span>
        <h2 className="font-bold text-gray-800 dark:text-gray-100">Metas Mensais</h2>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Defina o limite de gastos por categoria. Deixe em branco para remover a meta.
      </p>

      <div className="space-y-3">
        {EXPENSE_CATEGORIES.map((cat) => (
          <div key={cat} className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-28 shrink-0">{cat}</span>
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 dark:text-gray-500 pointer-events-none">
                R$
              </span>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="sem meta"
                value={values[cat] ?? ""}
                onChange={(e) => setValues((v) => ({ ...v, [cat]: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 dark:text-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow placeholder:text-gray-300 dark:placeholder:text-gray-600"
              />
            </div>
            <button
              onClick={() => handleSave(cat as Category)}
              className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 px-3 py-2 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors shrink-0"
            >
              Salvar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
