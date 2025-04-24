
import { getPlanoById } from "../config/planos";

export function getLogoRules(planoId: string, exibeLogoAgroSafe?: boolean) {
  const plano = getPlanoById(planoId);
  
  // Define regras de exibição de logo conforme o plano
  return {
    cliente: plano.logoCliente,
    agrosafe: plano.logoAgroSafeOpcional ? exibeLogoAgroSafe : plano.logoAgroSafe
  };
}
