"use server";

import prisma from "./prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { transactionSchema } from "./schemas";

export async function createTransaction(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Usuário não logado");

  const result = transactionSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!result.success) throw new Error(result.error.issues[0].message);

  await prisma.transaction.create({
    data: { ...result.data, userId },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/transactions");
}

export async function updateTransaction(transactionId: string, formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Usuário não logado");

  const result = transactionSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!result.success) throw new Error(result.error.issues[0].message);

  await prisma.transaction.update({
    where: { id: transactionId, userId },
    data: result.data,
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/transactions");
}

export async function deleteTransaction(transactionId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Usuário não logado");

  await prisma.transaction.delete({
    where: { id: transactionId, userId },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/transactions");
}

export async function upsertBudget(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Usuário não logado");

  const category = String(formData.get("category") ?? "").trim();
  const amount = parseFloat(String(formData.get("amount") ?? "0"));

  if (!category) throw new Error("Categoria inválida");
  if (isNaN(amount) || amount < 0) throw new Error("Valor inválido");

  if (amount === 0) {
    await prisma.budget.deleteMany({ where: { userId, category } });
  } else {
    await prisma.budget.upsert({
      where: { userId_category: { userId, category } },
      create: { userId, category, amount },
      update: { amount },
    });
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings");
}
