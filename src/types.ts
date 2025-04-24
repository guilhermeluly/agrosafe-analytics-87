
export interface ProductionData {
  id?: string;
  date: string;
  shift: string;
  location: string;
  plannedProduction: number;
  actualProduction: number;
  rework: number;
  scrap: number;
  lostPackages: number;
  setupTime: number;
  observations?: string;
}

export interface ReportSettings {
  frequency: 'diario'|'semanal'|'mensal'|'intervalo';
  hour: string;
  method: 'email'|'telegram';
  recipients: string[];
  customDates?: string[];
  filters?: { location?: string; shift?: string };
}

export interface User {
  id?: string;
  name: string;
  email: string;
  role: 'admin'|'editor'|'viewer';
}

// Nova estrutura para empresa e plano
export interface Empresa {
  id: string;
  nome: string;
  planoId: string;
  logoCliente?: string;
  logoAgroSafe?: string;
  exibeLogoAgroSafe?: boolean;
}

export interface SetupStandard {
  location: string;
  maxTimeMinutes: number;
}
