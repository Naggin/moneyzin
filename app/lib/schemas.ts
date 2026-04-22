import { z } from "zod";

export const transactionSchema = z.object({
  description: z.string().min(3, "A descrição deve ter pelo menos 3 caracteres"),
  amount: z.coerce.number().positive("O valor deve ser maior que zero"),
  type: z.enum(["INCOME", "EXPENSE"]),
  category: z.string().min(1, "Selecione uma categoria"),
});