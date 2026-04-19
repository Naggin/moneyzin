"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="flex flex-col md:flex-row items-center gap-1 md:gap-3 p-2 md:px-4 md:py-3 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl font-medium transition-colors w-full"
    >
      {theme === "dark" ? <Sun size={20} className="text-amber-500" /> : <Moon size={20} />}
      <span className="text-[10px] md:text-base font-medium">
        <span className="md:hidden">Tema</span>
        <span className="hidden md:inline">{theme === "dark" ? "Modo Claro" : "Modo Escuro"}</span>
      </span>
    </button>
  );
}