"use server";

import prisma from "./prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
// 1. Importamos o contrato de regras que você criou
import { transactionSchema } from "./schemas";

export async function createTransaction(formData: FormData) {
  // Segurança: Garante que só usuários logados salvam dados
  const { userId } = await auth();
  if (!userId) throw new Error("Usuário não logado");

  // Transforma o formulário bruto em um objeto simples
  const rawData = Object.fromEntries(formData.entries());

  // 2. A MÁGICA: O Zod valida tudo de uma vez (inclusive converte o valor para número)
  const result = transactionSchema.safeParse(rawData);

  // 3. Se as regras não forem seguidas, lançamos o erro específico
  if (!result.success) {
    // Pega a primeira mensagem de erro definida no seu schema.ts
   throw new Error(result.error.issues[0].message);
  }

  // 4. Salva no banco com os dados já limpos e validados pelo Zod
  await prisma.transaction.create({
    data: {
      ...result.data, // Aqui já temos description, amount (como número!), type e category
      userId,
    },
  });

  // 5. Atualiza o sistema para os novos dados aparecerem instantaneamente
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/transactions");
}

export async function deleteTransaction(transactionId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Usuário não logado");

  await prisma.transaction.delete({
    where: {
      id: transactionId,
      // Segurança extra: só deleta se a transação pertencer ao usuário logado
      userId: userId, 
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/transactions");
}