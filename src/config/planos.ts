
export const PLANOS = [
  {
    id: "basico",
    nome: "Básico",
    maxUsuarios: 5,
    modoApresentacao: false,
    autoRelatorios: false,
    exportCSV: false,
    analiseInteligente: false,
    logoCliente: false,
    logoAgroSafe: true,
    logoAgroSafeOpcional: false,
    obs: "Logo fixo da AgroSafe",
  },
  {
    id: "medio",
    nome: "Médio",
    maxUsuarios: 8,
    modoApresentacao: false,
    autoRelatorios: true,
    exportCSV: true,
    analiseInteligente: true,
    logoCliente: true,
    logoAgroSafe: true,
    logoAgroSafeOpcional: false,
    obs: "Ambos os logos sempre exibidos.",
  },
  {
    id: "completo",
    nome: "Completo",
    maxUsuarios: 10,
    modoApresentacao: true,
    autoRelatorios: true,
    exportCSV: true,
    analiseInteligente: true,
    logoCliente: true,
    logoAgroSafe: true,
    logoAgroSafeOpcional: true,
    obs: "Cliente pode optar remover o logo da AgroSafe.",
  },
];

export function getPlanoById(id: string) {
  return PLANOS.find(p => p.id === id) || PLANOS[0];
}
