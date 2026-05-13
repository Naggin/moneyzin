import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import prisma from "../../lib/prisma";
import ThemeToggle from "../../components/ThemeToggle";
import BudgetSettings from "../../components/BudgetSettings";

export default async function SettingsPage() {
  const [user, { userId }] = await Promise.all([currentUser(), auth()]);
  if (!user || !userId) redirect("/sign-in");

  const email = user.emailAddresses[0]?.emailAddress ?? "";
  const name = [user.firstName, user.lastName].filter(Boolean).join(" ") || "Usuário";

  const budgetRows = await prisma.budget.findMany({ where: { userId } });
  const budgets = Object.fromEntries(budgetRows.map((b) => [b.category, b.amount.toNumber()]));

  return (
    <div className="p-4 md:p-8 pb-24 md:pb-8 max-w-2xl mx-auto transition-colors duration-300">

      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">Configurações</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Gerencie sua conta e preferências.</p>
      </div>

      {/* Conta */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 mb-6 transition-colors duration-300">
        <h2 className="font-bold text-gray-800 dark:text-gray-100 mb-5">Conta</h2>
        <div className="flex items-center gap-4">
          {user.imageUrl && (
            <img
              src={user.imageUrl}
              alt={name}
              className="w-14 h-14 rounded-full object-cover ring-2 ring-gray-100 dark:ring-gray-800"
            />
          )}
          <div>
            <p className="font-semibold text-gray-800 dark:text-gray-100">{name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{email}</p>
          </div>
        </div>
      </div>

      {/* Metas */}
      <BudgetSettings budgets={budgets} />

      {/* Aparência */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 transition-colors duration-300">
        <h2 className="font-bold text-gray-800 dark:text-gray-100 mb-5">Aparência</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-800 dark:text-gray-100">Tema</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Alterne entre modo claro e escuro</p>
          </div>
          <div className="w-44 shrink-0">
            <ThemeToggle />
          </div>
        </div>
      </div>

    </div>
  );
}
