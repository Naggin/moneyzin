import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "../lib/prisma";
import { redirect } from "next/navigation";
import AddTransactionModal from "../components/AddTransactionModal";
import SummaryCards from "../components/SummaryCards";
import CategoryChart from "../components/CategoryChart";
import TopExpensesChart from "../components/TopExpensesChart";
import TopRevenuesChart from "../components/TopRevenuesChart";

export default async function DashboardPage() {
  // 1. Autenticação
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    redirect("/sign-in");
  }

  // 2. Sincronização do Usuário
  const dbUser = await prisma.user.upsert({
    where: { id: userId },
    update: {},
    create: {
      id: userId,
      email: user.emailAddresses[0].emailAddress,
      name: user.firstName || "Usuário",
    },
  });

  // 3. Busca de Dados
  const transactions = await prisma.transaction.findMany({
    where: { userId },
  });

  // 4. Cálculos Matemáticos
  const totalIncomes = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = totalIncomes - totalExpenses;

  return (
    <div className="p-8 pb-20 max-w-7xl mx-auto">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
            Olá, {dbUser.name?.split(" ")[0]}! 👋
          </h1>
          <p className="text-gray-500 mt-1">Sua central de inteligência financeira.</p>
        </div>
        <AddTransactionModal />
      </div>

      {/* Cards de Resumo (O seu componente atual) */}
      <SummaryCards 
        balance={balance} 
        incomes={totalIncomes} 
        expenses={totalExpenses} 
      />

      {/* A MÁGICA ACONTECE AQUI: Grid Moderno (Bento Box)
        Em telas grandes (lg), dividimos em 3 colunas.
      */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        
        {/* Bloco 1: Gráfico de Pizza (Ocupa 1 Coluna) */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col">
          <div className="mb-6">
            <h2 className="font-bold text-gray-800">Despesas por Categoria</h2>
            <p className="text-xs text-gray-400 mt-1">Distribuição do seu orçamento</p>
          </div>
          <CategoryChart transactions={transactions} />
        </div>

        {/* Bloco 2 e 3: Gráficos de Barras (Dividem as outras 2 colunas) */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Top Despesas */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h2 className="font-bold text-gray-800">Maiores Despesas</h2>
                <p className="text-xs text-gray-400 mt-1">Para onde o dinheiro foi</p>
              </div>
              {/* Ícone sutil para dar um charme */}
              <div className="p-2 bg-red-50 rounded-lg text-red-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="m17 5-5-3-5 3"/><path d="m17 19-5 3-5-3"/><path d="M2 12h20"/><path d="m5 7-3 5 3 5"/><path d="m19 7 3 5-3 5"/></svg>
              </div>
            </div>
            <TopExpensesChart transactions={transactions} />
          </div>

          {/* Top Receitas */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h2 className="font-bold text-gray-800">Maiores Receitas</h2>
                <p className="text-xs text-gray-400 mt-1">De onde o dinheiro veio</p>
              </div>
              {/* Ícone sutil para dar um charme */}
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="m17 5-5-3-5 3"/><path d="m17 19-5 3-5-3"/><path d="M2 12h20"/><path d="m5 7-3 5 3 5"/><path d="m19 7 3 5-3 5"/></svg>
              </div>
            </div>
            <TopRevenuesChart transactions={transactions} />
          </div>

        </div>
      </div>
    </div>
  );
}