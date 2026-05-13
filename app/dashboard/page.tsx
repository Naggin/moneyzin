import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "../lib/prisma";
import { redirect } from "next/navigation";
import AddTransactionModal from "../components/AddTransactionModal";
import SummaryCards from "../components/SummaryCards";
import CategoryChart from "../components/CategoryChart";
import TopExpensesChart from "../components/TopExpensesChart";
import TopRevenuesChart from "../components/TopRevenuesChart";
import MonthNavigator from "../components/MonthNavigator";
import BudgetProgress from "../components/BudgetProgress";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const [{ userId }, user] = await Promise.all([auth(), currentUser()]);

  if (!userId || !user) redirect("/sign-in");

  const params = await searchParams;
  const now = new Date();
  const brazilDate = now.toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" });
  const [defaultYear, defaultMonth] = brazilDate.split("-").map(Number);
  const month = Math.max(1, Math.min(12, Number(params.month) || defaultMonth));
  const year = Number(params.year) || defaultYear;

  const startDate = new Date(Date.UTC(year, month - 1, 1));
  const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

  const [dbUser, incomeAgg, expenseAgg, transactions, budgetRows] = await Promise.all([
    prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        email: user.emailAddresses[0].emailAddress,
        name: user.firstName || "Usuário",
      },
    }),
    prisma.transaction.aggregate({
      where: { userId, type: "INCOME", date: { gte: startDate, lte: endDate } },
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: { userId, type: "EXPENSE", date: { gte: startDate, lte: endDate } },
      _sum: { amount: true },
    }),
    prisma.transaction.findMany({
      where: { userId, date: { gte: startDate, lte: endDate } },
      orderBy: { date: "desc" },
    }),
    prisma.budget.findMany({ where: { userId } }),
  ]);

  const totalIncomes = incomeAgg._sum.amount?.toNumber() ?? 0;
  const totalExpenses = expenseAgg._sum.amount?.toNumber() ?? 0;
  const balance = totalIncomes - totalExpenses;

  const budgetItems = budgetRows
    .map((b) => ({
      category: b.category,
      limit: b.amount.toNumber(),
      spent: transactions
        .filter((t) => t.type === "EXPENSE" && t.category === b.category)
        .reduce((sum, t) => sum + t.amount.toNumber(), 0),
    }))
    .sort((a, b) => b.spent / b.limit - a.spent / a.limit);

  // Decimal não é serializável via JSON — converte antes de passar para Client Components
  const serializedTransactions = transactions.map((t) => ({
    ...t,
    amount: t.amount.toNumber(),
    date: t.date.toISOString(),
  }));

  return (
    <div className="p-4 md:p-8 pb-24 md:pb-8 max-w-7xl mx-auto transition-colors duration-300">

      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 tracking-tight transition-colors">
            Olá, {dbUser.name?.split(" ")[0]}!
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 transition-colors">Sua central de inteligência financeira.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <MonthNavigator month={month} year={year} />
          <AddTransactionModal />
        </div>
      </div>

      <SummaryCards balance={balance} incomes={totalIncomes} expenses={totalExpenses} />

      <div className="mt-6">
        <BudgetProgress items={budgetItems} month={month} year={year} />
      </div>

      {/* Grid Bento Moderno */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">

        {/* Bloco 1: Gráfico de Pizza */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 flex flex-col transition-colors duration-300">
          <div className="mb-6">
            <h2 className="font-bold text-gray-800 dark:text-gray-100">Despesas por Categoria</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Distribuição do seu orçamento</p>
          </div>
          <CategoryChart transactions={serializedTransactions} />
        </div>

        {/* Bloco 2 e 3 */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 transition-colors duration-300">
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h2 className="font-bold text-gray-800 dark:text-gray-100">Maiores Despesas</h2>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Para onde o dinheiro foi</p>
              </div>
              <div className="p-2 bg-red-50 dark:bg-red-500/10 rounded-lg text-red-500 dark:text-red-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="m17 5-5-3-5 3"/><path d="m17 19-5 3-5-3"/><path d="M2 12h20"/><path d="m5 7-3 5 3 5"/><path d="m19 7 3 5-3 5"/></svg>
              </div>
            </div>
            <TopExpensesChart transactions={serializedTransactions} />
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 transition-colors duration-300">
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h2 className="font-bold text-gray-800 dark:text-gray-100">Maiores Receitas</h2>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">De onde o dinheiro veio</p>
              </div>
              <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg text-emerald-500 dark:text-emerald-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="m17 5-5-3-5 3"/><path d="m17 19-5 3-5-3"/><path d="M2 12h20"/><path d="m5 7-3 5 3 5"/><path d="m19 7 3 5-3 5"/></svg>
              </div>
            </div>
            <TopRevenuesChart transactions={serializedTransactions} />
          </div>

        </div>
      </div>
    </div>
  );
}
