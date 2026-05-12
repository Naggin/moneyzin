import { z } from "zod";

export const CATEGORIES = [
  "Alimentação",
  "Transporte",
  "Moradia",
  "Salário",
  "Lazer",
  "Outros",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const transactionSchema = z.object({
  description: z.string().min(3, "A descrição deve ter pelo menos 3 caracteres"),
  amount: z.coerce.number().positive("O valor deve ser maior que zero"),
  type: z.enum(["INCOME", "EXPENSE"]),
  category: z.enum(CATEGORIES, { error: "Categoria inválida" }),
  date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida")
    .transform((s) => new Date(s + "T12:00:00.000Z")),
});