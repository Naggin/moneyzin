"use client";

import { useState } from "react";
import { Plus, X, Pencil } from "lucide-react";
import { createTransaction, updateTransaction } from "../lib/actions";
import { toast } from "sonner";

interface TransactionData {
  id: string;
  description: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  category: string;
  date: string;
}

interface Props {
  transaction?: TransactionData;
}

export default function AddTransactionModal({ transaction }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const isEditing = Boolean(transaction);

  const today = new Date().toLocaleDateString("en-CA"); // "YYYY-MM-DD"
  const defaultDate = transaction
    ? transaction.date.split("T")[0]
    : today;

  async function handleAction(formData: FormData) {
    try {
      if (isEditing && transaction) {
        await updateTransaction(transaction.id, formData);
        toast.success("Transação atualizada com sucesso!");
      } else {
        await createTransaction(formData);
        toast.success("Transação salva com sucesso!");
      }
      setIsOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Ops! Algo deu errado.");
      console.error(error);
    }
  }

  return (
    <>
      {isEditing ? (
        <button
          onClick={() => setIsOpen(true)}
          className="text-gray-400 hover:text-emerald-500 dark:text-gray-500 dark:hover:text-emerald-400 transition-colors p-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-500/10"
          title="Editar transação"
        >
          <Pencil size={16} />
        </button>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus size={20} />
          Nova Transação
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-md shadow-xl border border-gray-100 dark:border-gray-800 transition-colors">

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                {isEditing ? "Editar Transação" : "Nova Transação"}
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form action={handleAction} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descrição</label>
                <input
                  type="text"
                  name="description"
                  required
                  placeholder="Ex: Salário, Mercado, Luz..."
                  defaultValue={transaction?.description ?? ""}
                  className="w-full bg-transparent border border-gray-200 dark:border-gray-700 dark:text-gray-100 rounded-xl p-3 outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow placeholder:text-gray-400 dark:placeholder:text-gray-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Valor (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="amount"
                    required
                    placeholder="0.00"
                    defaultValue={transaction?.amount ?? ""}
                    className="w-full bg-transparent border border-gray-200 dark:border-gray-700 dark:text-gray-100 rounded-xl p-3 outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow placeholder:text-gray-400 dark:placeholder:text-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Data</label>
                  <input
                    type="date"
                    name="date"
                    required
                    defaultValue={defaultDate}
                    className="w-full bg-transparent border border-gray-200 dark:border-gray-700 dark:text-gray-100 rounded-xl p-3 outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tipo</label>
                <div className="flex gap-4">
                  <label className="flex-1 cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      value="INCOME"
                      required
                      className="peer sr-only"
                      defaultChecked={transaction ? transaction.type === "INCOME" : false}
                    />
                    <div className="text-center py-3 border border-gray-200 dark:border-gray-700 dark:text-gray-300 rounded-xl peer-checked:bg-emerald-50 dark:peer-checked:bg-emerald-500/10 peer-checked:border-emerald-500 dark:peer-checked:border-emerald-500 peer-checked:text-emerald-700 dark:peer-checked:text-emerald-400 font-medium transition-colors">
                      Receita
                    </div>
                  </label>
                  <label className="flex-1 cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      value="EXPENSE"
                      required
                      className="peer sr-only"
                      defaultChecked={transaction ? transaction.type === "EXPENSE" : false}
                    />
                    <div className="text-center py-3 border border-gray-200 dark:border-gray-700 dark:text-gray-300 rounded-xl peer-checked:bg-red-50 dark:peer-checked:bg-red-500/10 peer-checked:border-red-500 dark:peer-checked:border-red-500 peer-checked:text-red-700 dark:peer-checked:text-red-400 font-medium transition-colors">
                      Despesa
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Categoria</label>
                <select
                  name="category"
                  required
                  defaultValue={transaction?.category ?? "Alimentação"}
                  className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 dark:text-gray-100 rounded-xl p-3 outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow"
                >
                  <option value="Alimentação">Alimentação</option>
                  <option value="Transporte">Transporte</option>
                  <option value="Moradia">Moradia</option>
                  <option value="Salário">Salário</option>
                  <option value="Lazer">Lazer</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-medium transition-colors mt-6 shadow-sm"
              >
                {isEditing ? "Salvar alterações" : "Salvar Transação"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
