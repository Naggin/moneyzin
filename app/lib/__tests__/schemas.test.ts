import { describe, it, expect } from "vitest";
import { transactionSchema, CATEGORIES } from "../schemas";

const validBase = {
  description: "Supermercado",
  amount: "150.50",
  type: "EXPENSE",
  category: "Alimentação",
  date: "2025-01-15",
};

describe("transactionSchema", () => {
  describe("casos válidos", () => {
    it("aceita uma transação de despesa válida", () => {
      const result = transactionSchema.safeParse(validBase);
      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data.amount).toBe(150.5);
      expect(result.data.type).toBe("EXPENSE");
    });

    it("aceita uma transação de receita válida", () => {
      const result = transactionSchema.safeParse({
        ...validBase,
        type: "INCOME",
        category: "Salário",
        description: "Salário mensal",
        amount: "5000",
      });
      expect(result.success).toBe(true);
    });

    it("converte amount string para número", () => {
      const result = transactionSchema.safeParse({ ...validBase, amount: "99.99" });
      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(typeof result.data.amount).toBe("number");
      expect(result.data.amount).toBe(99.99);
    });

    it("transforma date string em objeto Date com horário UTC 12:00", () => {
      const result = transactionSchema.safeParse({ ...validBase, date: "2025-06-01" });
      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data.date).toBeInstanceOf(Date);
      expect(result.data.date.toISOString()).toBe("2025-06-01T12:00:00.000Z");
    });

    it("aceita todas as categorias válidas", () => {
      for (const category of CATEGORIES) {
        const result = transactionSchema.safeParse({ ...validBase, category });
        expect(result.success, `categoria "${category}" deveria ser válida`).toBe(true);
      }
    });
  });

  describe("description", () => {
    it("rejeita descrição com menos de 3 caracteres", () => {
      const result = transactionSchema.safeParse({ ...validBase, description: "ab" });
      expect(result.success).toBe(false);
      if (result.success) return;
      expect(result.error.issues[0].message).toBe("A descrição deve ter pelo menos 3 caracteres");
    });

    it("aceita descrição com exatamente 3 caracteres", () => {
      const result = transactionSchema.safeParse({ ...validBase, description: "abc" });
      expect(result.success).toBe(true);
    });

    it("rejeita descrição vazia", () => {
      const result = transactionSchema.safeParse({ ...validBase, description: "" });
      expect(result.success).toBe(false);
    });
  });

  describe("amount", () => {
    it("rejeita valor zero", () => {
      const result = transactionSchema.safeParse({ ...validBase, amount: "0" });
      expect(result.success).toBe(false);
      if (result.success) return;
      expect(result.error.issues[0].message).toBe("O valor deve ser maior que zero");
    });

    it("rejeita valor negativo", () => {
      const result = transactionSchema.safeParse({ ...validBase, amount: "-10" });
      expect(result.success).toBe(false);
    });

    it("rejeita valor não-numérico", () => {
      const result = transactionSchema.safeParse({ ...validBase, amount: "abc" });
      expect(result.success).toBe(false);
    });

    it("aceita valores decimais com vírgula convertida", () => {
      const result = transactionSchema.safeParse({ ...validBase, amount: "1500.75" });
      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data.amount).toBe(1500.75);
    });
  });

  describe("type", () => {
    it("rejeita tipo inválido", () => {
      const result = transactionSchema.safeParse({ ...validBase, type: "TRANSFER" });
      expect(result.success).toBe(false);
    });

    it("rejeita type em minúsculas", () => {
      const result = transactionSchema.safeParse({ ...validBase, type: "expense" });
      expect(result.success).toBe(false);
    });
  });

  describe("category", () => {
    it("rejeita categoria fora da lista", () => {
      const result = transactionSchema.safeParse({ ...validBase, category: "Investimentos" });
      expect(result.success).toBe(false);
      if (result.success) return;
      expect(result.error.issues[0].message).toBe("Categoria inválida");
    });

    it("rejeita categoria vazia", () => {
      const result = transactionSchema.safeParse({ ...validBase, category: "" });
      expect(result.success).toBe(false);
    });
  });

  describe("date", () => {
    it("rejeita formato de data inválido (dd/mm/yyyy)", () => {
      const result = transactionSchema.safeParse({ ...validBase, date: "15/01/2025" });
      expect(result.success).toBe(false);
      if (result.success) return;
      expect(result.error.issues[0].message).toBe("Data inválida");
    });

    it("rejeita string que não é data", () => {
      const result = transactionSchema.safeParse({ ...validBase, date: "hoje" });
      expect(result.success).toBe(false);
    });

    it("rejeita data com separador errado", () => {
      const result = transactionSchema.safeParse({ ...validBase, date: "2025.01.15" });
      expect(result.success).toBe(false);
    });
  });
});
