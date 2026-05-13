"use client";

import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { useVisibility } from "../contexts/VisibilityContext";
import { useTheme } from "next-themes";

const CATEGORY_COLORS: Record<string, string> = {
  "Alimentação": "#ea580c", 
  "Transporte": "#2563eb",  
  "Moradia": "#9333ea",     
  "Salário": "#16a34a",     
  "Lazer": "#db2777",       
  "Outros": "#4b5563",      
};

export default function CategoryChart({ transactions }: { transactions: any[] }) {
  const { isVisible } = useVisibility();
  const { theme } = useTheme();
  const [chartType, setChartType] = useState<"donut" | "bar">("donut");

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

  const tooltipStyle = {
    backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
    borderColor: theme === "dark" ? "#374151" : "#e5e7eb",
    color: theme === "dark" ? "#f3f4f6" : "#111827",
    borderRadius: "12px",
    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
  };

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-gray-400">
        Nenhuma despesa para mostrar no gráfico.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 flex-1">
      <div className="flex gap-1">
        <button
          onClick={() => setChartType("donut")}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${chartType === "donut" ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400" : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"}`}
        >
          Pizza
        </button>
        <button
          onClick={() => setChartType("bar")}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${chartType === "bar" ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400" : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"}`}
        >
          Barras
        </button>
      </div>

      <div className={`h-[260px] w-full transition-all duration-300 ${!isVisible ? "blur-md opacity-60 select-none pointer-events-none" : ""}`}>
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "donut" ? (
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={5} dataKey="value">
                {data.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || CATEGORY_COLORS["Outros"]} />
                ))}
              </Pie>
              <Tooltip formatter={formatTooltip} contentStyle={tooltipStyle} itemStyle={{ color: theme === "dark" ? "#e5e7eb" : "#374151" }} />
              <Legend />
            </PieChart>
          ) : (
            <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === "dark" ? "#374151" : "#f3f4f6"} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: theme === "dark" ? "#9ca3af" : "#6b7280" }} angle={-35} textAnchor="end" interval={0} tickLine={false} axisLine={false} />
              <YAxis hide />
              <Tooltip formatter={formatTooltip} contentStyle={tooltipStyle} itemStyle={{ color: theme === "dark" ? "#e5e7eb" : "#374151" }} cursor={{ fill: theme === "dark" ? "#374151" : "#f3f4f6" }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={28}>
                {data.map((entry: any) => (
                  <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] || CATEGORY_COLORS["Outros"]} />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}