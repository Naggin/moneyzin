import { unstable_cache } from "next/cache";
import prisma from "./prisma";

// Budgets mudam raramente — cache de 1 hora, invalidado por tag ao salvar
export const getCachedBudgets = unstable_cache(
  async (userId: string) => prisma.budget.findMany({ where: { userId } }),
  ["budgets"],
  { tags: ["budgets"], revalidate: 3600 }
);

// Transações de um mês específico — cache de 60s, invalidado por tag ao mutar
export const getCachedTransactions = unstable_cache(
  async (userId: string, year: number, month: number) => {
    const startDate = new Date(Date.UTC(year, month - 1, 1));
    const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));
    return prisma.transaction.findMany({
      where: { userId, date: { gte: startDate, lte: endDate } },
      orderBy: { date: "desc" },
    });
  },
  ["transactions"],
  { tags: ["transactions"], revalidate: 60 }
);

export const getCachedIncomeAgg = unstable_cache(
  async (userId: string, year: number, month: number) => {
    const startDate = new Date(Date.UTC(year, month - 1, 1));
    const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));
    return prisma.transaction.aggregate({
      where: { userId, type: "INCOME", date: { gte: startDate, lte: endDate } },
      _sum: { amount: true },
    });
  },
  ["income-agg"],
  { tags: ["transactions"], revalidate: 60 }
);

export const getCachedExpenseAgg = unstable_cache(
  async (userId: string, year: number, month: number) => {
    const startDate = new Date(Date.UTC(year, month - 1, 1));
    const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));
    return prisma.transaction.aggregate({
      where: { userId, type: "EXPENSE", date: { gte: startDate, lte: endDate } },
      _sum: { amount: true },
    });
  },
  ["expense-agg"],
  { tags: ["transactions"], revalidate: 60 }
);

export const getCachedEvolutionTxs = unstable_cache(
  async (userId: string, year: number, month: number) => {
    const evolutionStart = new Date(Date.UTC(year, month - 6, 1));
    const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));
    return prisma.transaction.findMany({
      where: { userId, date: { gte: evolutionStart, lte: endDate } },
      select: { date: true, type: true, amount: true },
    });
  },
  ["evolution-txs"],
  { tags: ["transactions"], revalidate: 60 }
);
