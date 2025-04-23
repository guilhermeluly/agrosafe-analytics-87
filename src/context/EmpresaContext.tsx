
import React, { createContext, useContext, useState, ReactNode } from "react";
import { getPlanoById } from "../config/planos";

export type EmpresaInfo = {
  id?: string;
  nome: string;
  planoId: string;
  logo?: string; // Added logo property
  logoCliente?: string;
  logoAgroSafe?: string;
  exibeLogoAgroSafe?: boolean; // para plano completo controlar exibição
  unidadeCapacidade: 'unidades/h' | 'kg/h';
  dataVencimento?: string;
  dataCadastro?: string;
  ativo?: boolean;
};

const defaultEmpresa: EmpresaInfo = {
  nome: "Andrealan AgroSafe",
  planoId: "completo",
  logo: "/logo_app.png", // Added default logo
  logoAgroSafe: "/logo_agrosafe.png",
  logoCliente: "/logo_app.png",
  exibeLogoAgroSafe: true,
  unidadeCapacidade: 'unidades/h',
  dataCadastro: new Date().toISOString().split('T')[0],
  ativo: true
};

type EmpresaContextType = {
  empresa: EmpresaInfo;
  setEmpresa: (e: EmpresaInfo) => void;
  updateLogo: (logoUrl: string) => void; // Added updateLogo function
};

const EmpresaContext = createContext<EmpresaContextType | null>(null);

interface EmpresaProviderProps {
  children: ReactNode;
}

export const EmpresaProvider: React.FC<EmpresaProviderProps> = ({ children }) => {
  const [empresa, setEmpresa] = useState<EmpresaInfo>(defaultEmpresa);
  
  // Add the updateLogo function
  const updateLogo = (logoUrl: string) => {
    setEmpresa({ ...empresa, logo: logoUrl });
  };
  
  return (
    <EmpresaContext.Provider value={{ empresa, setEmpresa, updateLogo }}>
      {children}
    </EmpresaContext.Provider>
  );
};

export function useEmpresa() {
  const context = useContext(EmpresaContext);
  if (!context) throw new Error("useEmpresa deve estar dentro do provider");
  return context;
}
