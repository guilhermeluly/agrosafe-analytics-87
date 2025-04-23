
import React, { createContext, useContext, useState } from "react";
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

const EmpresaContext = createContext<{
  empresa: EmpresaInfo;
  setEmpresa: (e: EmpresaInfo) => void;
} | null>(null);

export function EmpresaProvider({ children }) {
  const [empresa, setEmpresa] = useState<EmpresaInfo>(defaultEmpresa);
  return (
    <EmpresaContext.Provider value={{ empresa, setEmpresa }}>
      {children}
    </EmpresaContext.Provider>
  );
}

export function useEmpresa() {
  const v = useContext(EmpresaContext);
  if (!v) throw new Error("useEmpresa deve estar dentro do provider");
  return v;
}
