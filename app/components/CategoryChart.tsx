"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
// 1. Importação no topo (certo!)
import { useVisibility } from "../contexts/VisibilityContext";

const CATEGORY_COLORS: Record<string, string> = {
  "Alimentação": "#ea580c", 
  "Transporte": "#2563eb",  
  "Moradia": "#9333ea",     
  "Salário": "#16a34a",     
  "Lazer": "#db2777",       
  "Outros": "#4b5563",      
};

export default function CategoryChart({ transactions }: { transactions: any[] }) {
  // 2. Chamamos a nuvem na PRIMEIRA linha da função
  const { isVisible } = useVisibility();

  // Separa as despesas
  const expenses = transactions.filter((t: any) => t.type === "EXPENSE");

  // Calcula o total de RECEITAS para podermos fazer a porcentagem
  const totalIncome = transactions
    .filter((t: any) => t.type === "INCOME")
    .reduce((acc: number, t: any) => acc + t.amount, 0);

  // Agrupa os valores por categoria
  const dataMap = expenses.reduce((acc: Record<string, number>, transaction: any) => {
    const cat = transaction.category || "Outros";
    acc[cat] = (acc[cat] || 0) + transaction.amount;
    return acc;
  }, {});

  const data = Object.entries(dataMap)
    .map(([name, value]: [string, any]) => ({ name, value: Number(value) }))
    .sort((a: any, b: any) => b.value - a.value);

  // Turbinando o balãozinho para mostrar R$ e a Porcentagem
  const formatTooltip = (value: any) => {
    const gasto = Number(value);
    
    // Formata o valor em Reais
    const valorFormatado = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(gasto);

    // Se a pessoa tiver receita, calcula a %, se não, evita erro de divisão por zero
    if (totalIncome > 0) {
      const porcentagem = ((gasto / totalIncome) * 100).toFixed(1);
      return `${valorFormatado} (${porcentagem}% da Receita)`;
    }

    return valorFormatado;
  };

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-gray-400">
        Nenhuma despesa para mostrar no gráfico.
      </div>
    );
  }

  return (
    // 3. A MÁGICA DO DESFOQUE ACONTECE AQUI NESTA DIV:
    <div className={`h-[300px] w-full transition-all duration-300 ${!isVisible ? 'blur-md opacity-60 select-none pointer-events-none' : ''}`}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={90}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry: any, index: number) => (
              <Cell 
                key={`cell-${index}`} 
                fill={CATEGORY_COLORS[entry.name] || CATEGORY_COLORS["Outros"]} 
              />
            ))}
          </Pie>
          <Tooltip formatter={formatTooltip} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}