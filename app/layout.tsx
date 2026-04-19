import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs'
import "./globals.css";

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
      {/* A MÁGICA ACONTECE AQUI: adicionamos suppressHydrationWarning */}
      <html lang="pt-BR" suppressHydrationWarning>
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}