"use client";

import { Trash2 } from "lucide-react";
import { deleteTransaction } from "../lib/actions";

// Ele recebe o ID da transação para saber exatamente quem apagar
export default function DeleteButton({ transactionId }: { transactionId: string }) {
  
  const handleDelete = async () => {
    // Uma pequena confirmação de segurança para não apagar sem querer
    const confirmDelete = window.confirm("Tem certeza que deseja apagar esta transação?");
    
    if (confirmDelete) {
      await deleteTransaction(transactionId);
    }
  };

  return (
    <button 
      onClick={handleDelete}
      className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-4"
      title="Excluir transação"
    >
      <Trash2 size={18} />
    </button>
  );
}