import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "../lib/prisma";
import { redirect } from "next/navigation";
import AddTransactionModal from "../components/AddTransactionModal";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import DeleteButton from "../components/DeleteButton";

export default async function DashboardPage() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    redirect("/sign-in");
  }

  // 1. Sincroniza o usuário (Upsert)
  const dbUser = await prisma.user.upsert({
    where: { id: userId },
    update: {},
    create: {
      id: userId,
      email: user.emailAddresses[0].emailAddress,
      name: user.firstName || "Usuário",
    },
  });

  // 2. BUSCA AS TRANSAÇÕES: Pegamos todas as transações deste usuário no banco
  const transactions = await prisma.transaction.findMany({
    where: { userId },
  });

  // 3. MATEMÁTICA FINANCEIRA: Calculamos os totais
  const totalIncomes = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = totalIncomes - totalExpenses;

  // Função auxiliar para formatar em R$
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Olá, {dbUser.name?.split(" ")[0]}! 👋
          </h1>
          <p className="text-gray-500 mt-1">Aqui está o resumo das suas finanças.</p>
        </div>
        <AddTransactionModal />
      </div>

      {/* CARDS DE SALDO REAIS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Card Saldo Total */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 text-gray-500 mb-2">
            <Wallet size={20} />
            <span className="text-sm font-medium">Saldo Total</span>
          </div>
          <p className={`text-2xl font-bold ${balance >= 0 ? 'text-gray-800' : 'text-red-600'}`}>
            {formatCurrency(balance)}
          </p>
        </div>

        {/* Card Receitas */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 text-emerald-500 mb-2">
            <TrendingUp size={20} />
            <span className="text-sm font-medium">Receitas</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{formatCurrency(totalIncomes)}</p>
        </div>

        {/* Card Despesas */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 text-red-500 mb-2">
            <TrendingDown size={20} />
            <span className="text-sm font-medium">Despesas</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{formatCurrency(totalExpenses)}</p>
        </div>
      </div>

      {/* LISTA DE TRANSAÇÕES RECENTES */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50">
          <h2 className="font-bold text-gray-800">Transações Recentes</h2>
        </div>
        <div className="divide-y divide-gray-50">
         {transactions.length === 0 ? (
            <p className="p-8 text-center text-gray-400">Nenhuma transação encontrada.</p>
          ) : (
            transactions.reverse().slice(0, 5).map((t) => (
              <div key={t.id} className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                <div>
                  <p className="font-medium text-gray-800">{t.description}</p>
                  <p className="text-xs text-gray-400">{new Date(t.date).toLocaleDateString('pt-BR')}</p>
                </div>
                
                {/* Agrupamos o valor e o botão na mesma linha */}
                <div className="flex items-center">
                  <p className={`font-semibold ${t.type === 'INCOME' ? 'text-emerald-500' : 'text-red-500'}`}>
                    {t.type === 'INCOME' ? '+' : '-'} {formatCurrency(t.amount)}
                  </p>
                  
                  {/* Nossa lixeira nova entra aqui! */}
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