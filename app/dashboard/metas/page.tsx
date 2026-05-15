import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getCachedBudgets, getCachedTransactions } from "../../lib/cached-queries";
import BudgetSettings from "../../components/BudgetSettings";
import BudgetProgress from "../../components/BudgetProgress";
import MonthNavigator from "../../components/MonthNavigator";

export default async function MetasPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const params = await searchParams;
  const now = new Date();
  const brazilDate = now.toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" });
  const [defaultYear, defaultMonth] = brazilDate.split("-").map(Number);
  const month = Math.max(1, Math.min(12, Number(params.month) || defaultMonth));
  const year = Number(params.year) || defaultYear;

  const [budgetRows, transactions] = await Promise.all([
    getCachedBudgets(userId),
    getCachedTransactions(userId, year, month),
  ]);

  const budgets = Object.fromEntries(budgetRows.map((b) => [b.category, b.amount]));

  const budgetItems = budgetRows
    .map((b) => ({
      category: b.category,
      limit: b.amount,
      spent: transactions
        .filter((t) => t.type === "EXPENSE" && t.category === b.category)
        .reduce((sum: number, t) => sum + t.amount, 0),
    }))
    .sort((a, b) => b.spent / b.limit - a.spent / a.limit);

  return (
    <div className="p-4 md:p-8 pb-24 md:pb-8 max-w-4xl mx-auto transition-colors duration-300">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">Metas do mês</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Defina e acompanhe seus limites de gastos por categoria.</p>
        </div>
        <MonthNavigator month={month} year={year} />
      </div>

      {/* Duas colunas: Configurar à esquerda, Progresso à direita */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configurar Metas */}
        <BudgetSettings budgets={budgets} />

        {/* Progresso */}
        <BudgetProgress items={budgetItems} month={month} year={year} />
      </div>
    </div>
  );
}
