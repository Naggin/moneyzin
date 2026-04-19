"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// Define o formato da nossa "nuvem" de memória
type VisibilityContextType = {
  isVisible: boolean;
  toggleVisibility: () => void;
};

// Cria o contexto vazio
const VisibilityContext = createContext<VisibilityContextType | undefined>(undefined);

// Esse é o "provedor" que vai abraçar o seu Dashboard inteiro
export function VisibilityProvider({ children }: { children: ReactNode }) {
  const [isVisible, setIsVisible] = useState(true); // Começa mostrando os valores

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <VisibilityContext.Provider value={{ isVisible, toggleVisibility }}>
      {children}
    </VisibilityContext.Provider>
  );
}

// Uma função atalho para os componentes pegarem a informação rápido
export function useVisibility() {
  const context = useContext(VisibilityContext);
  if (context === undefined) {
    throw new Error("useVisibility deve ser usado dentro de um VisibilityProvider");
  }
  return context;
}