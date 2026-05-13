import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';
import "./globals.css";
import { Toaster } from "sonner";
// 1. IMPORTAMOS O THEME PROVIDER AQUI NA RAIZ DO PROJETO
import { ThemeProvider } from "./providers/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://moneyzin.vercel.app"),
  title: {
    default: "Moneyzin",
    template: "%s | Moneyzin",
  },
  description: "Controle financeiro pessoal. Registre gastos, acompanhe receitas e visualize para onde vai seu dinheiro — tudo em um só lugar.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://moneyzin.vercel.app",
    siteName: "Moneyzin",
    title: "Moneyzin — Suas finanças, simplificadas.",
    description: "Controle financeiro pessoal com dashboard, metas de orçamento e relatórios em PDF e Excel.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Moneyzin — Suas finanças, simplificadas.",
    description: "Controle financeiro pessoal com dashboard, metas de orçamento e relatórios em PDF e Excel.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="pt-BR" suppressHydrationWarning>
        <body className={inter.className}>
          {/* 2. ELE ABRAÇA TODO O SISTEMA AQUI: */}
          <ThemeProvider>
            <Toaster richColors position="bottom-right" />
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}