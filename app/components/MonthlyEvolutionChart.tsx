"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useTheme } from "next-themes";
import { useVisibility } from "../contexts/VisibilityContext";

export interface MonthlyPoint {
  month: string;
  receitas: number;
  despesas: number;
}

const formatCurrency = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

export default function MonthlyEvolutionChart({ data }: { data: MonthlyPoint[] }) {
  const { theme } = useTheme();
  const { isVisible } = useVisibility();

  const tooltipStyle = {
    backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
    borderColor: theme === "dark" ? "#374151" : "#e5e7eb",
    color: theme === "dark" ? "#f3f4f6" : "#111827",
    borderRadius: "12px",
    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
  };

  const isEmpty = data.every((d) => d.receitas === 0 && d.despesas === 0);
  if (isEmpty) {
    return (
      <div className="flex items-center justify-center h-[250px] text-gray-400 dark:text-gray-500">
        Nenhum dado para exibir.
      </div>
    );
  }

  return (
    <div className={`h-[250px] w-full transition-all duration-300 ${!isVisible ? "blur-md opacity-60 select-none pointer-events-none" : ""}`}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme === "dark" ? "#374151" : "#f3f4f6"} />
          <XAxis
            dataKey="month"
            stroke={theme === "dark" ? "#9ca3af" : "#6b7280"}
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis hide />
          <Tooltip
            formatter={(val) => formatCurrency(Number(val))}
            contentStyle={tooltipStyle}
            itemStyle={{ color: theme === "dark" ? "#e5e7eb" : "#374151" }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="receitas"
            name="Receitas"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="despesas"
            name="Despesas"
            stroke="#ef4444"
            strokeWidth={2}
            dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
