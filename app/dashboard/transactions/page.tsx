import { auth } from "@clerk/nextjs/server";
import prisma from "../../lib/prisma"; 
import { redirect } from "next/navigation";
import DeleteButton from "../../components/DeleteButton";
import AddTransactionModal from "../../components/AddTransactionModal";

// 🪄 Turbinamos as etiquetas para ficarem chiques no modo escuro (dark:bg-... dark:text-...)
const getCategoryStyles = (category: string) => {
  switch (category) {
    case "Alimentação": return "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400";
    case "Transporte": return "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400";
    case "Moradia": return "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400";
    case "Salário": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400";
    case "Lazer": return "bg-pink-100 text-pink-700 dark:bg-pink-500/10 dark:text-pink-400";
    default: return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
  }
};

export default async function TransactionsPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

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
    // Adicionado pb-24 pro celular não espremer, igual na tela inicial
    <div className="p-8 pb-24 md:pb-8 transition-colors duration-300">
      
      {/* Cabeçalho Escurecido */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 transition-colors">Transações</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 transition-colors">Histórico completo de todas as suas movimentações.</p>
        </div>
        <AddTransactionModal />
      </div>

      {/* Tabela de Transações Escurecida */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden transition-colors duration-300">
        
        <div className="p-6 border-b border-gray-50 dark:border-gray-800 transition-colors">
          <h2 className="font-bold text-gray-800 dark:text-gray-100">Lista Completa</h2>
        </div>
        
        <div className="divide-y divide-gray-50 dark:divide-gray-800 transition-colors">
          {transactions.length === 0 ? (
            <p className="p-8 text-center text-gray-400 dark:text-gray-500">Nenhuma transação encontrada.</p>
          ) : (
            transactions.map((t) => (
              // Efeito de hover (passar o mouse) adaptado pro modo escuro
              <div key={t.id} className="p-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div>
                  <div className="flex items-center gap-3">
                    <p className="font-medium text-gray-800 dark:text-gray-100 transition-colors">{t.description}</p>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold tracking-wide uppercase transition-colors ${getCategoryStyles(t.category)}`}>
                      {t.category}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 transition-colors">
                    {new Date(t.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                  </p>
                </div>
                
                <div className="flex items-center gap-4">
                  {/* Cores de positivo/negativo continuam, mas adaptadas se precisar */}
                  <p className={`font-semibold transition-colors ${t.type === 'INCOME' ? 'text-emerald-500 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
                    {t.type === 'INCOME' ? '+' : '-'} {formatCurrency(t.amount)}
                  </p>
                  
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