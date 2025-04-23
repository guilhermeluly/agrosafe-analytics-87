
import React, { createContext, useContext, useState, ReactNode } from "react";
import { getPlanoById } from "../config/planos";

export type EmpresaInfo = {
  nome: string;
  planoId: string;
  logoCliente?: string;
  logoAgroSafe?: string;
  exibeLogoAgroSafe?: boolean; // para plano completo controlar exibição
};

const defaultEmpresa: EmpresaInfo = {
  nome: "Andrealan AgroSafe",
  planoId: "completo",
  logoAgroSafe: "/logo_agrosafe.png",
  logoCliente: "/logo_app.png",
  exibeLogoAgroSafe: true,
};

type EmpresaContextType = {
  empresa: EmpresaInfo;
  setEmpresa: (e: EmpresaInfo) => void;
};

const EmpresaContext = createContext<EmpresaContextType | null>(null);

interface EmpresaProviderProps {
  children: ReactNode;
}

export const EmpresaProvider: React.FC<EmpresaProviderProps> = ({ children }) => {
  const [empresa, setEmpresa] = useState<EmpresaInfo>(defaultEmpresa);
  
  return (
    <EmpresaContext.Provider value={{ empresa, setEmpresa }}>
      {children}
    </EmpresaContext.Provider>
  );
};

export function useEmpresa() {
  const context = useContext(EmpresaContext);
  if (!context) throw new Error("useEmpresa deve estar dentro do provider");
  return context;
}
