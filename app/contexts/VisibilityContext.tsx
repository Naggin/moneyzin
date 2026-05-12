"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type VisibilityContextType = {
  isVisible: boolean;
  toggleVisibility: () => void;
};

const VisibilityContext = createContext<VisibilityContextType | undefined>(undefined);

export function VisibilityProvider({ children }: { children: ReactNode }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("balanceVisible");
    if (stored !== null) setIsVisible(stored === "true");
  }, []);

  const toggleVisibility = () => {
    setIsVisible((prev) => {
      const next = !prev;
      localStorage.setItem("balanceVisible", String(next));
      return next;
    });
  };

  return (
    <VisibilityContext.Provider value={{ isVisible, toggleVisibility }}>
      {children}
    </VisibilityContext.Provider>
  );
}

export function useVisibility() {
  const context = useContext(VisibilityContext);
  if (context === undefined) {
    throw new Error("useVisibility deve ser usado dentro de um VisibilityProvider");
  }
  return context;
}
