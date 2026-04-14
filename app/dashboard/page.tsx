import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "../lib/prisma";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  // 1. Pega quem está logado lá no Clerk
  const { userId } = await auth();
  const user = await currentUser();

  // 2. Se por algum milagre o segurança deixar passar alguém sem login, a gente chuta de volta
  if (!userId || !user) {
    redirect("/sign-in");
  }

  // 3. A Mágica do UPSERT (Sincronizando Clerk com o nosso Banco Supabase)
  const dbUser = await prisma.user.upsert({
    where: { id: userId },
    update: {}, // Se já existir, não faz nada
    create: {   // Se não existir, cria com os dados do Clerk!
      id: userId,
      email: user.emailAddresses[0].emailAddress,
      name: user.firstName || "Usuário",
    },
  });

  // 4. A Interface que o usuário vai ver
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gray-50 p-8">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center max-w-md w-full">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
          {dbUser.name?.charAt(0)}
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Olá, {dbUser.name}! 👋
        </h1>
        <p className="text-gray-500">
          Seu usuário do Clerk acabou de ser salvo no banco de dados do Supabase. O back-end está 100% vivo!
        </p>
      </div>
    </div>
  );
}