"use client";

import { Trash2 } from "lucide-react";
import { deleteTransaction } from "../lib/actions";
import { toast } from "sonner";
import { useState } from "react";

export default function DeleteButton({ transactionId }: { transactionId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    // Confirmação de segurança antes de apagar
    const confirm = window.confirm("Tem certeza que deseja apagar esta transação?");
    if (!confirm) return;

    setIsDeleting(true);
    
    try {
      await deleteTransaction(transactionId);
      // Toca o aviso verdinho/sucesso!
      toast.success("Transação apagada com sucesso! 🗑️");
    } catch (error) {
      // Toca o aviso vermelhinho se der erro!
      toast.error("Ops! Erro ao apagar a transação.");
      console.error(error);
      setIsDeleting(false); // Reativa o botão caso a internet tenha falhado
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      title="Apagar transação"
    >
      {/* Se estiver deletando, mostra um "..." ou apenas escurece o botão, se não, mostra a lixeira */}
      <Trash2 size={18} className={isDeleting ? "animate-pulse" : ""} />
    </button>
  );
}