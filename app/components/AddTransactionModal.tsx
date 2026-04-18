"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { createTransaction } from "../lib/actions";

export default function AddTransactionModal() {
  const [isOpen, setIsOpen] = useState(false);

  // Função que intercepta o clique do botão salvar
  async function handleAction(formData: FormData) {
    await createTransaction(formData); // Manda pro banco
    setIsOpen(false); // Fecha a janelinha
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors shadow-sm"
      >
        <Plus size={20} />
        Nova Transação
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-gray-100">
            
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Nova Transação</h2>
              <button 
                onClick={() => setIsOpen(false)} 
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Aqui ligamos a Ação do Servidor (action={handleAction}) */}
            <form action={handleAction} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <input 
                  type="text" 
                  name="description" 
                  required
                  placeholder="Ex: Salário, Mercado, Luz..." 
                  className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$)</label>
                <input 
                  type="number" 
                  step="0.01" 
                  name="amount"
                  required
                  placeholder="0.00" 
                  className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                <div className="flex gap-4">
                  <label className="flex-1 cursor-pointer">
                    {/* name="type" é crucial aqui */}
                    <input type="radio" name="type" value="INCOME" required className="peer sr-only" />
                    <div className="text-center py-3 border border-gray-200 rounded-xl peer-checked:bg-emerald-50 peer-checked:border-emerald-500 peer-checked:text-emerald-700 font-medium transition-colors">
                      Receita
                    </div>
                  </label>
                  <label className="flex-1 cursor-pointer">
                    <input type="radio" name="type" value="EXPENSE" required className="peer sr-only" />
                    <div className="text-center py-3 border border-gray-200 rounded-xl peer-checked:bg-red-50 peer-checked:border-red-500 peer-checked:text-red-700 font-medium transition-colors">
                      Despesa
                    </div>
                  </label>
                </div>
              </div>

              {/* NOVO CAMPO: CATEGORIA */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                <select 
                  name="category" 
                  required
                  className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow bg-white"
                >
                  <option value="Alimentação">🍔 Alimentação</option>
                  <option value="Transporte">🚗 Transporte</option>
                  <option value="Moradia">🏠 Moradia</option>
                  <option value="Salário">💰 Salário</option>
                  <option value="Lazer">🍿 Lazer</option>
                  <option value="Outros">📦 Outros</option>
                </select>
              </div>

              <button 
                type="submit" 
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-medium transition-colors mt-6 shadow-sm"
              >
                Salvar Transação
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}