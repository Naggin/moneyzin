"use server"; // Isso é mágico: garante que esse código NUNCA vaze para o navegador, roda só no servidor

import prisma from "./prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function createTransaction(formData: FormData) {
  // 1. Pega quem está logado
  const { userId } = await auth();
  if (!userId) throw new Error("Usuário não logado");

  // 2. Extrai os dados que o usuário digitou no formulário (AGORA COM CATEGORIA)
  const description = formData.get("description") as string;
  const amountString = formData.get("amount") as string;
  const type = formData.get("type") as string;
  const category = formData.get("category") as string;

  // 3. Validação básica de segurança
  if (!description || !amountString || !type || !category) {
    throw new Error("Preencha todos os campos");
  }

  // Converte o texto do valor para número (Float)
  const amount = parseFloat(amountString.replace(",", "."));

  // 4. Salva de fato no banco de dados!
  await prisma.transaction.create({
    data: {
      description,
      amount,
      type,
      category, // <-- Mandamos a nossa categoria nova diretamente para cá
      userId,
    },
  });

  // 5. Manda o Next.js atualizar a tela do Dashboard para mostrar os números novos
  revalidatePath("/dashboard");
}

export async function deleteTransaction(transactionId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Usuário não logado");

  // Manda o Prisma deletar a transação que tenha esse ID específico
  await prisma.transaction.delete({
    where: {
      id: transactionId,
    },
  });

  // Atualiza a tela do Dashboard para o card de saldo recalcular instantaneamente
  revalidatePath("/dashboard");
}