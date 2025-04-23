
import { getPlanoById } from "../config/planos";

export function getLogoRules(planoId: string, opcionalAgroSafe?: boolean) {
  const plano = getPlanoById(planoId);
  if (!plano) return { agrosafe: true, cliente: false };

  return {
    agrosafe: plano.logoAgroSafeOpcional ? !!opcionalAgroSafe : plano.logoAgroSafe,
    cliente: plano.logoCliente,
    agrosafeOpcional: plano.logoAgroSafeOpcional,
  };
}
