import { auth } from "@clerk/nextjs/server";
import prisma from "../../lib/prisma"; // Note os dois pontos duplos aqui para voltar duas pastas!
import { redirect } from "next/navigation";
import DeleteButton from "../../components/DeleteButton";
import AddTransactionModal from "../../components/AddTransactionModal";

// A nossa função de cores das etiquetas que estava na tela inicial
const getCategoryStyles = (category: string) => {
  switch (category) {
    case "Alimentação": return "bg-orange-100 text-orange-700";
    case "Transporte": return "bg-blue-100 text-blue-700";
    case "Moradia": return "bg-purple-100 text-purple-700";
    case "Salário": return "bg-emerald-100 text-emerald-700";
    case "Lazer": return "bg-pink-100 text-pink-700";
    default: return "bg-gray-100 text-gray-700";
  }
};

export default async function TransactionsPage() {
  // Segurança primeiro
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  // Busca TODAS as transações do usuário, da mais nova para a mais velha
  const transactions = await prisma.transaction.findMany({
    where: { userId },
    orderBy: {
      date: 'desc'
    }
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="p-8">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Transações</h1>
          <p className="text-gray-500 mt-1">Histórico completo de todas as suas movimentações.</p>
        </div>
        {/* Deixamos o botão de Nova Transação aqui também por conveniência */}
        <AddTransactionModal />
      </div>

      {/* Tabela de Transações */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50">
          <h2 className="font-bold text-gray-800">Lista Completa</h2>
        </div>
        
        <div className="divide-y divide-gray-50">
          {transactions.length === 0 ? (
            <p className="p-8 text-center text-gray-400">Nenhuma transação encontrada.</p>
          ) : (
            transactions.map((t) => (
              <div key={t.id} className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                <div>
                  <div className="flex items-center gap-3">
                    <p className="font-medium text-gray-800">{t.description}</p>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold tracking-wide uppercase ${getCategoryStyles(t.category)}`}>
                      {t.category}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(t.date).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                
                <div className="flex items-center gap-4">
                  <p className={`font-semibold ${t.type === 'INCOME' ? 'text-emerald-500' : 'text-red-500'}`}>
                    {t.type === 'INCOME' ? '+' : '-'} {formatCurrency(t.amount)}
                  </p>
                  
                  {/* Botão de Excluir */}
                  <DeleteButton transactionId={t.id} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}