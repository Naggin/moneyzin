"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
// 1. IMPORTAÇÃO DA NUVEM NO TOPO DO ARQUIVO
import { useVisibility } from "../contexts/VisibilityContext";

// 🪄 A mesma função de formatação
const formatDescription = (text: string) => {
  if (!text) return "";

  const correcoes: Record<string, string> = {
    "salario": "salário",
    "ferias": "férias",
    "decimo": "décimo",
    "terceiro": "terceiro",
    "bonus": "bônus",
    "premio": "prêmio",
    "rendimento": "rendimento",
    "poupanca": "poupança",
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

export default function TopRevenuesChart({ transactions }: { transactions: any[] }) {
  // 2. CHAMAMOS A NUVEM NA PRIMEIRA LINHA DA FUNÇÃO
  const { isVisible } = useVisibility();

  const topRevenuesData = transactions
    .filter((t: any) => t.type === "INCOME")
    .sort((a: any, b: any) => b.amount - a.amount)
    .slice(0, 5)
    .map((t: any) => {
      // Descrição formatada
      const descBonita = formatDescription(t.description);

      return {
        name: descBonita.length > 20 ? descBonita.slice(0, 17) + "..." : descBonita,
        value: t.amount,
      };
    });

  const formatCurrency = (value: any) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(value));
  };

  if (topRevenuesData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[250px] text-gray-400">
        Nenhuma receita registrada.
      </div>
    );
  }

  return (
    // 3. A MÁGICA DO DESFOQUE NA DIV PRINCIPAL DO GRÁFICO
    <div className={`h-[250px] w-full transition-all duration-300 ${!isVisible ? 'blur-md opacity-60 select-none pointer-events-none' : ''}`}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={topRevenuesData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} width={100} />
          <Tooltip 
            formatter={formatCurrency}
            contentStyle={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '10px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Bar dataKey="value" fill="#10b981" radius={[0, 8, 8, 0]} barSize={24}>
            {topRevenuesData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill="#34d399" fillOpacity={1 - index * 0.15} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}