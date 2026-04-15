import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "../lib/prisma";
import { redirect } from "next/navigation";
import AddTransactionModal from "../components/AddTransactionModal";
import SummaryCards from "../components/SummaryCards";
import DeleteButton from "../components/DeleteButton";

export default async function DashboardPage() {
  // 1. Autenticação e Segurança
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    redirect("/sign-in");
  }

  // 2. Sincronização de Usuário (Upsert)
  const dbUser = await prisma.user.upsert({
    where: { id: userId },
    update: {},
    create: {
      id: userId,
      email: user.emailAddresses[0].emailAddress,
      name: user.firstName || "Usuário",
    },
  });

  // 3. Busca de Dados: Pegamos todas as transações do banco
  const transactions = await prisma.transaction.findMany({
    where: { userId },
    orderBy: {
      date: 'desc' // Já traz as mais recentes primeiro
    }
  });

  // 4. Cálculos Matemáticos
  const totalIncomes = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = totalIncomes - totalExpenses;

  // Função auxiliar para formatar moeda na lista
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
          <h1 className="text-3xl font-bold text-gray-800">
            Olá, {dbUser.name?.split(" ")[0]}! 👋
          </h1>
          <p className="text-gray-500 mt-1">Aqui está o resumo das suas finanças.</p>
        </div>
        <AddTransactionModal />
      </div>

      {/* Cards de Resumo (Com o olhinho de ocultar) */}
      <SummaryCards 
        balance={balance} 
        incomes={totalIncomes} 
        expenses={totalExpenses} 
      />

      {/* Lista de Transações */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50">
          <h2 className="font-bold text-gray-800">Transações Recentes</h2>
        </div>
        
        <div className="divide-y divide-gray-50">
          {transactions.length === 0 ? (
            <p className="p-8 text-center text-gray-400">Nenhuma transação encontrada.</p>
          ) : (
            transactions.slice(0, 10).map((t) => (
              <div key={t.id} className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                <div>
                  <p className="font-medium text-gray-800">{t.description}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(t.date).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                
                <div className="flex items-center">
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