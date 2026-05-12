import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer";
import { createElement, type ReactElement } from "react";
import PDFDocument from "@/app/components/PDFDocument";

export const dynamic = "force-dynamic";

const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

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

  const transactionData = transactions.map(t => ({
    id: t.id,
    description: t.description,
    amount: t.amount.toNumber(),
    type: t.type as "INCOME" | "EXPENSE",
    category: t.category,
    date: t.date.toISOString(),
  }));

  const document = createElement(PDFDocument, {
    transactions: transactionData,
    month,
    year,
    totalIncome,
    totalExpense,
  });

  const buffer = await renderToBuffer(document as ReactElement<DocumentProps>);

  const filename = `moneyzin-${MONTHS[month - 1].toLowerCase()}-${year}.pdf`;

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
