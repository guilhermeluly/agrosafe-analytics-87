
import React from "react";
import { getLogoRules } from "../services/planoUtils";
import { useEmpresa } from "../context/EmpresaContext";

export default function LogoDisplay({ altura = 48, showLabel = false }) {
  const { empresa } = useEmpresa();
  const logos = getLogoRules(empresa.planoId, empresa.exibeLogoAgroSafe);

  return (
    <div className="flex items-center gap-6">
      {logos.cliente && empresa.logoCliente && (
        <img src={empresa.logoCliente} style={{ height: altura }} alt="Logo da Empresa" />
      )}
      {logos.agrosafe && empresa.logoAgroSafe && (
        <img src={empresa.logoAgroSafe} style={{ height: altura }} alt="Logo da AgroSafe" />
      )}
      {showLabel && (
        <span className="ml-4 text-xs text-gray-400">
          Plano: <b>{empresa.planoId}</b>
        </span>
      )}
    </div>
  );
}
