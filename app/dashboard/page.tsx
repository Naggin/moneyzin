import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "../lib/prisma";
import { redirect } from "next/navigation";
import AddTransactionModal from "../components/AddTransactionModal";
import SummaryCards from "../components/SummaryCards";
import MonthNavigator from "../components/MonthNavigator";
import DraggableDashboardGrid from "../components/DraggableDashboardGrid";

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

  const evolutionStart = new Date(Date.UTC(year, month - 6, 1));

  const [dbUser, incomeAgg, expenseAgg, transactions, budgetRows, evolutionTxs] = await Promise.all([
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
    prisma.transaction.findMany({
      where: { userId, date: { gte: evolutionStart, lte: endDate } },
      select: { date: true, type: true, amount: true },
    }),
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

  const serializedTransactions = transactions.map((t) => ({
    ...t,
    amount: t.amount.toNumber(),
    date: t.date.toISOString(),
  }));

  const MONTH_NAMES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  const monthlyMap: Record<string, { month: string; receitas: number; despesas: number }> = {};
  for (let i = 5; i >= 0; i--) {
    const d = new Date(Date.UTC(year, month - 1 - i, 1));
    const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
    monthlyMap[key] = { month: MONTH_NAMES[d.getUTCMonth()], receitas: 0, despesas: 0 };
  }
  for (const t of evolutionTxs) {
    const d = new Date(t.date);
    const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
    if (monthlyMap[key]) {
      if (t.type === "INCOME") monthlyMap[key].receitas += t.amount.toNumber();
      else monthlyMap[key].despesas += t.amount.toNumber();
    }
  }
  const monthlyData = Object.values(monthlyMap);

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

      <DraggableDashboardGrid
        budgetItems={budgetItems}
        month={month}
        year={year}
        transactions={serializedTransactions}
        monthlyData={monthlyData}
      />
    </div>
  );
}
