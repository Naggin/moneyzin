"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useVisibility } from "../contexts/VisibilityContext";
// 1. Importamos o olheiro do Modo Escuro
import { useTheme } from "next-themes";

const formatDescription = (text: string) => {
  if (!text) return "";

  const correcoes: Record<string, string> = {
    "cartao": "cartão",
    "credito": "crédito",
    "debito": "débito",
    "agua": "água",
    "gas": "gás",
    "onibus": "ônibus",
    "taxi": "táxi",
    "salario": "salário",
    "poupanca": "poupança",
    "refeicao": "refeição",
    "alimentacao": "alimentação",
    "familia": "família",
  };

  const preposicoes = ["de", "da", "do", "das", "dos", "e", "em", "na", "no", "com", "sem"];
  const palavras = text.toLowerCase().split(" ");

  const textoFormatado = palavras.map((palavra, index) => {
    let corrigida = correcoes[palavra] || palavra;
    if (preposicoes.includes(corrigida) && index !== 0) {
      return corrigida;
    }
    return corrigida.charAt(0).toUpperCase() + corrigida.slice(1);
  });

  return textoFormatado.join(" ");
};

export default function TopExpensesChart({ transactions }: { transactions: any[] }) {
  const { isVisible } = useVisibility();
  // 2. Avisamos o componente qual é o tema atual
  const { theme } = useTheme();

  const topExpensesData = transactions
    .filter((t: any) => t.type === "EXPENSE")
    .sort((a: any, b: any) => b.amount - a.amount)
    .slice(0, 5)
    .map((t: any) => {
      const descBonita = formatDescription(t.description);
      return {
        name: descBonita.length > 20 ? descBonita.slice(0, 17) + "..." : descBonita,
        value: t.amount,
      };
    });

  const formatCurrency = (value: any) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(value));
  };

  if (topExpensesData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[250px] text-gray-400 dark:text-gray-500">
        Nenhuma despesa registrada.
      </div>
    );
  }

  // 3. Estilos dinâmicos do balãozinho
  const tooltipStyle = {
    backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
    borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
    color: theme === 'dark' ? '#f3f4f6' : '#111827',
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
  };

  return (
    <div className={`h-[250px] w-full transition-all duration-300 ${!isVisible ? 'blur-md opacity-60 select-none pointer-events-none' : ''}`}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={topExpensesData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
        >
          {/* Ajustamos a cor da grade pontilhada */}
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={theme === 'dark' ? '#374151' : '#f3f4f6'} />
          <XAxis type="number" hide />
          {/* Ajustamos a cor do texto do Eixo Y */}
          <YAxis type="category" dataKey="name" stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} fontSize={12} tickLine={false} axisLine={false} width={100} />
          
          {/* Aplicamos os estilos dinâmicos no Tooltip e adicionamos um cursor de fundo escuro */}
          <Tooltip 
            formatter={formatCurrency}
            contentStyle={tooltipStyle}
            itemStyle={{ color: theme === 'dark' ? '#e5e7eb' : '#374151' }}
            cursor={{ fill: theme === 'dark' ? '#374151' : '#f3f4f6' }}
          />
          
          <Bar dataKey="value" fill="#ef4444" radius={[0, 8, 8, 0]} barSize={24}>
            {topExpensesData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill="#f87171" fillOpacity={1 - index * 0.15} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}