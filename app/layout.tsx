import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';
import "./globals.css";
import { Toaster } from "sonner";
// 1. IMPORTAMOS O THEME PROVIDER AQUI NA RAIZ DO PROJETO
import { ThemeProvider } from "./providers/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Moneyzin",
  description: "Sistema de controle financeiro minimalista",
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