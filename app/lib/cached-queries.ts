import { unstable_cache } from "next/cache";
import prisma from "./prisma";

export const getCachedBudgets = unstable_cache(
  async (userId: string) => {
    const rows = await prisma.budget.findMany({ where: { userId } });
    return rows.map((r) => ({ ...r, amount: r.amount.toNumber() }));
  },
  ["budgets"],
  { tags: ["budgets"], revalidate: 3600 }
);

export const getCachedTransactions = unstable_cache(
  async (userId: string, year: number, month: number) => {
    const startDate = new Date(Date.UTC(year, month - 1, 1));
    const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));
    const rows = await prisma.transaction.findMany({
      where: { userId, date: { gte: startDate, lte: endDate } },
      orderBy: { date: "desc" },
    });
    return rows.map((r) => ({ ...r, amount: r.amount.toNumber(), date: r.date.toISOString() }));
  },
  ["transactions"],
  { tags: ["transactions"], revalidate: 60 }
);

export const getCachedIncomeAgg = unstable_cache(
  async (userId: string, year: number, month: number) => {
    const startDate = new Date(Date.UTC(year, month - 1, 1));
    const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));
    const agg = await prisma.transaction.aggregate({
      where: { userId, type: "INCOME", date: { gte: startDate, lte: endDate } },
      _sum: { amount: true },
    });
    return { _sum: { amount: agg._sum.amount?.toNumber() ?? null } };
  },
  ["income-agg"],
  { tags: ["transactions"], revalidate: 60 }
);

export const getCachedExpenseAgg = unstable_cache(
  async (userId: string, year: number, month: number) => {
    const startDate = new Date(Date.UTC(year, month - 1, 1));
    const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));
    const agg = await prisma.transaction.aggregate({
      where: { userId, type: "EXPENSE", date: { gte: startDate, lte: endDate } },
      _sum: { amount: true },
    });
    return { _sum: { amount: agg._sum.amount?.toNumber() ?? null } };
  },
  ["expense-agg"],
  { tags: ["transactions"], revalidate: 60 }
);

export const getCachedEvolutionTxs = unstable_cache(
  async (userId: string, year: number, month: number) => {
    const evolutionStart = new Date(Date.UTC(year, month - 6, 1));
    const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));
    const rows = await prisma.transaction.findMany({
      where: { userId, date: { gte: evolutionStart, lte: endDate } },
      select: { date: true, type: true, amount: true },
    });
    return rows.map((r) => ({ ...r, amount: r.amount.toNumber(), date: r.date.toISOString() }));
  },
  ["evolution-txs"],
  { tags: ["transactions"], revalidate: 60 }
);
