"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import CategoryChart from "./CategoryChart";
import TopExpensesChart from "./TopExpensesChart";
import TopRevenuesChart from "./TopRevenuesChart";
import BudgetProgress from "./BudgetProgress";
import MonthlyEvolutionChart, { MonthlyPoint } from "./MonthlyEvolutionChart";

interface BudgetItem {
  category: string;
  limit: number;
  spent: number;
}

interface Props {
  budgetItems: BudgetItem[];
  month: number;
  year: number;
  transactions: any[];
  monthlyData: MonthlyPoint[];
}

type WidgetId = "budgetProgress" | "categoryChart" | "topExpenses" | "topRevenues" | "monthlyEvolution";

const STORAGE_KEY = "moneyzin-dashboard-order";
const DEFAULT_ORDER: WidgetId[] = ["budgetProgress", "categoryChart", "topExpenses", "topRevenues", "monthlyEvolution"];

const WIDGET_SPAN: Record<WidgetId, string> = {
  budgetProgress: "col-span-1 lg:col-span-3",
  categoryChart: "col-span-1",
  topExpenses: "col-span-1",
  topRevenues: "col-span-1",
  monthlyEvolution: "col-span-1 lg:col-span-3",
};

const WIDGET_INFO: Record<WidgetId, { title: string; description: string }> = {
  budgetProgress: { title: "Metas do mês", description: "Progresso por categoria" },
  categoryChart: { title: "Despesas por Categoria", description: "Distribuição do seu orçamento" },
  topExpenses: { title: "Maiores Despesas", description: "Para onde o dinheiro foi" },
  topRevenues: { title: "Maiores Receitas", description: "De onde o dinheiro veio" },
  monthlyEvolution: { title: "Evolução Mensal", description: "Receitas e despesas dos últimos 6 meses" },
};

function loadOrder(): WidgetId[] {
  if (typeof window === "undefined") return DEFAULT_ORDER;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as WidgetId[];
      if (parsed.length === DEFAULT_ORDER.length && DEFAULT_ORDER.every((id) => parsed.includes(id))) {
        return parsed;
      }
    }
  } catch {}
  return DEFAULT_ORDER;
}

// Ghost card shown in DragOverlay — no recharts, no distortion
function WidgetGhost({ id }: { id: WidgetId }) {
  const { title, description } = WIDGET_INFO[id];
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-emerald-400 dark:border-emerald-500 shadow-2xl p-6 cursor-grabbing rotate-1 opacity-95">
      <h2 className="font-bold text-gray-800 dark:text-gray-100">{title}</h2>
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{description}</p>
      <div className="mt-4 h-32 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
    </div>
  );
}

function SortableWidget({ id, span, isDraggingAny, children }: { id: string; span: string; isDraggingAny: boolean; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDraggingAny ? transition : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group ${span} ${isDragging ? "opacity-0" : ""}`}
    >
      <div
        {...attributes}
        {...listeners}
        className="absolute top-3 right-3 z-10 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400"
        title="Arraste para reorganizar"
      >
        <GripVertical size={15} />
      </div>
      {children}
    </div>
  );
}

export default function DraggableDashboardGrid({ budgetItems, month, year, transactions, monthlyData }: Props) {
  const [order, setOrder] = useState<WidgetId[]>(loadOrder);
  const [activeId, setActiveId] = useState<WidgetId | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as WidgetId);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setOrder((prev) => {
        const next = arrayMove(prev, prev.indexOf(active.id as WidgetId), prev.indexOf(over.id as WidgetId));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    }
  }

  function renderWidget(id: WidgetId) {
    switch (id) {
      case "budgetProgress":
        return <BudgetProgress items={budgetItems} month={month} year={year} />;

      case "categoryChart":
        return (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 flex flex-col h-full transition-colors duration-300">
            <div className="mb-4">
              <h2 className="font-bold text-gray-800 dark:text-gray-100">Despesas por Categoria</h2>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Distribuição do seu orçamento</p>
            </div>
            <CategoryChart transactions={transactions} />
          </div>
        );

      case "topExpenses":
        return (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 h-full transition-colors duration-300">
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h2 className="font-bold text-gray-800 dark:text-gray-100">Maiores Despesas</h2>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Para onde o dinheiro foi</p>
              </div>
              <div className="p-2 bg-red-50 dark:bg-red-500/10 rounded-lg text-red-500 dark:text-red-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="m17 5-5-3-5 3"/><path d="m17 19-5 3-5-3"/><path d="M2 12h20"/><path d="m5 7-3 5 3 5"/><path d="m19 7 3 5-3 5"/></svg>
              </div>
            </div>
            <TopExpensesChart transactions={transactions} />
          </div>
        );

      case "topRevenues":
        return (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 h-full transition-colors duration-300">
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h2 className="font-bold text-gray-800 dark:text-gray-100">Maiores Receitas</h2>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">De onde o dinheiro veio</p>
              </div>
              <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg text-emerald-500 dark:text-emerald-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="m17 5-5-3-5 3"/><path d="m17 19-5 3-5-3"/><path d="M2 12h20"/><path d="m5 7-3 5 3 5"/><path d="m19 7 3 5-3 5"/></svg>
              </div>
            </div>
            <TopRevenuesChart transactions={transactions} />
          </div>
        );

      case "monthlyEvolution":
        return (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 h-full transition-colors duration-300">
            <div className="mb-6">
              <h2 className="font-bold text-gray-800 dark:text-gray-100">Evolução Mensal</h2>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Receitas e despesas dos últimos 6 meses</p>
            </div>
            <MonthlyEvolutionChart data={monthlyData} />
          </div>
        );
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={order} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {order.map((id) => (
            <SortableWidget key={id} id={id} span={WIDGET_SPAN[id]} isDraggingAny={activeId !== null}>
              {renderWidget(id)}
            </SortableWidget>
          ))}
        </div>
      </SortableContext>

      <DragOverlay dropAnimation={{ duration: 150, easing: "ease" }}>
        {activeId ? <WidgetGhost id={activeId} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
