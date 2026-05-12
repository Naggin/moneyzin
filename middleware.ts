import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', '/']);

export default clerkMiddleware(async (auth, request) => {
  const { userId } = await auth();

  // Redireciona usuário autenticado da landing page direto para o dashboard
  if (userId && request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Pula os arquivos internos do Next.js e arquivos estáticos
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Sempre roda para rotas de API
    '/(api|trpc)(.*)',
  ],
};