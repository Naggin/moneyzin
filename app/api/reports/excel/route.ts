import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import * as XLSX from "xlsx";

export const dynamic = "force-dynamic";

const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const now = new Date();
  const brazilDate = now.toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" });
  const [defaultYear, defaultMonth] = brazilDate.split("-").map(Number);

  const { searchParams } = req.nextUrl;
  const month = Math.max(1, Math.min(12, Number(searchParams.get("month")) || defaultMonth));
  const year = Number(searchParams.get("year")) || defaultYear;

  const startDate = new Date(Date.UTC(year, month - 1, 1));
  const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

  const transactions = await prisma.transaction.findMany({
    where: { userId, date: { gte: startDate, lte: endDate } },
    orderBy: { date: "desc" },
  });

  const totalIncome = transactions
    .filter(t => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount.toNumber(), 0);

  const totalExpense = transactions
    .filter(t => t.type === "EXPENSE")
    .reduce((sum, t) => sum + t.amount.toNumber(), 0);

  const wb = XLSX.utils.book_new();

  // Sheet 1: Transactions
  const rows = transactions.map(t => ({
    "Data": new Date(t.date).toLocaleDateString("pt-BR", { timeZone: "UTC" }),
    "Descrição": t.description,
    "Tipo": t.type === "INCOME" ? "Receita" : "Despesa",
    "Categoria": t.category,
    "Valor (R$)": t.amount.toNumber(),
  }));

  const wsTransactions = XLSX.utils.json_to_sheet(rows);
  wsTransactions["!cols"] = [
    { wch: 12 }, { wch: 36 }, { wch: 12 }, { wch: 16 }, { wch: 14 },
  ];
  XLSX.utils.book_append_sheet(wb, wsTransactions, "Transações");

  // Sheet 2: Summary
  const summaryRows = [
    { "Resumo": "Período", "Valor": `${MONTHS[month - 1]} ${year}` },
    { "Resumo": "", "Valor": "" },
    { "Resumo": "Total Receitas", "Valor": formatCurrency(totalIncome) },
    { "Resumo": "Total Despesas", "Valor": formatCurrency(totalExpense) },
    { "Resumo": "Saldo", "Valor": formatCurrency(totalIncome - totalExpense) },
    { "Resumo": "", "Valor": "" },
    { "Resumo": "Nº de Transações", "Valor": String(transactions.length) },
    { "Resumo": "Nº de Receitas", "Valor": String(transactions.filter(t => t.type === "INCOME").length) },
    { "Resumo": "Nº de Despesas", "Valor": String(transactions.filter(t => t.type === "EXPENSE").length) },
  ];

  const wsSummary = XLSX.utils.json_to_sheet(summaryRows);
  wsSummary["!cols"] = [{ wch: 22 }, { wch: 20 }];
  XLSX.utils.book_append_sheet(wb, wsSummary, "Resumo");

  const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

  const filename = `moneyzin-${MONTHS[month - 1].toLowerCase()}-${year}.xlsx`;

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
