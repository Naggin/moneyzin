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
